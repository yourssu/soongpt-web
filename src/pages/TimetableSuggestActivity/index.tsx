import { useFlow } from '@stackflow/react/future';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

import { getTimetableSuggest } from '@/api/timetableSuggest';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { Timetable } from '@/components/Timetable';
import { useToast } from '@/hooks/useToast';
import { SectionTitle } from '@/pages/TimetableSuggestActivity/components/SectionTitle';
import { SuggestionCard } from '@/pages/TimetableSuggestActivity/components/SuggestionCard';
import { TimetableSuggestItemType } from '@/schemas/timetableSuggestSchema';
import { FLOW_PROGRESS } from '@/stackflow/progress';

const getSelectedCount = (selectedActions: Record<string, string[]>) => {
  return Object.values(selectedActions).reduce((sum, list) => sum + list.length, 0);
};

export const TimetableSuggestActivity = () => {
  const { push } = useFlow();
  const toast = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['timetable_suggest'],
    queryFn: () => getTimetableSuggest(),
  });

  const [selectedActions, setSelectedActions] = useState<Record<string, string[]>>({});
  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const hasAnySelection = useMemo(() => getSelectedCount(selectedActions) > 0, [selectedActions]);
  const isNoticeSelectionComplete = useMemo(() => {
    if (!data) {
      return false;
    }

    if (data.result.notices.length === 0) {
      return true;
    }

    return data.result.notices.every((notice) => (selectedActions[notice.id] ?? []).length > 0);
  }, [data, selectedActions]);
  const isNoticeBlocking = !!data && data.result.notices.length > 0 && !isNoticeSelectionComplete;

  const toggleAction = (item: TimetableSuggestItemType, actionKey: string) => {
    setSelectedActions((prev) => {
      const current = prev[item.id] ?? [];
      const exists = current.includes(actionKey);

      if (item.selectionMode === 'multiple') {
        const next = exists ? current.filter((key) => key !== actionKey) : [...current, actionKey];
        return { ...prev, [item.id]: next };
      }

      if (exists) {
        return { ...prev, [item.id]: [] };
      }

      return { ...prev, [item.id]: [actionKey] };
    });
  };

  const handleCtaClick = () => {
    if (!isNoticeSelectionComplete) {
      return;
    }

    const selectedCount = getSelectedCount(selectedActions);
    if (selectedCount === 0) {
      toast.default('선택사항 없이 시간표를 만들게요.');
      push('draft_timetable', {});
      return;
    }
    toast.default(`선택사항 ${selectedCount}개를 반영해요.`);
    push('draft_timetable', {});
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea
        onScroll={(event) => {
          const target = event.currentTarget;
          if (sheetState === 'peek' && target.scrollTop > 24) {
            setSheetState('open');
          }
        }}
      >
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_suggest} />
          <div className="mt-6 flex flex-1 flex-col items-start">
            <h2 className="text-[24px]/[normal] font-semibold">
              지금까지 선택한 과목들로
              <br />
              만들어본 임시 시간표예요!
            </h2>
            <span className="text-neutralSubtle mt-2 text-sm font-light">
              * 최종 시간표를 위한 안내와 제안이 있어요.
            </span>
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="w-full pb-[260px]">
            {isLoading || !data ? (
              <Timetable.Skeleton className="pt-4" isSelected />
            ) : (
              <Timetable isSelected timetable={data.result.timetable} />
            )}
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>

      {data && (
        <BottomSheet onStateChange={setSheetState} peekHeight={200} state={sheetState}>
          <BottomSheet.Body>
            <div className="flex flex-col gap-4">
              <SectionTitle dotClassName="bg-red-500" title="시간표 생성 불가 안내" />
              <div className="flex flex-col gap-3">
                {data.result.notices.map((item) => (
                  <SuggestionCard
                    isSelected={(actionKey) => (selectedActions[item.id] ?? []).includes(actionKey)}
                    item={item}
                    key={item.id}
                    onActionClick={(actionKey) => toggleAction(item, actionKey)}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionTitle dotClassName="bg-purple-500" title="더 나은 시간표를 위한 제안" />
              <div className="flex flex-col gap-3">
                {data.result.suggestions.map((item) => (
                  <SuggestionCard
                    isSelected={(actionKey) => (selectedActions[item.id] ?? []).includes(actionKey)}
                    item={item}
                    key={item.id}
                    onActionClick={(actionKey) => toggleAction(item, actionKey)}
                  />
                ))}
              </div>
            </div>
          </BottomSheet.Body>

          <BottomSheet.Footer className="pt-4">
            <button
              className={
                isNoticeSelectionComplete
                  ? 'bg-brandPrimary h-14 w-full rounded-2xl text-[16px] font-semibold text-white'
                  : 'bg-bg-buttonDisabled text-text-buttonDisabled h-14 w-full rounded-2xl text-[16px] font-semibold'
              }
              disabled={!isNoticeSelectionComplete}
              onClick={handleCtaClick}
              type="button"
            >
              {isNoticeBlocking
                ? '시간이 겹쳐 생성할 수 없어요'
                : hasAnySelection
                  ? '선택사항 반영하고 시간표 만들기'
                  : '반영하지 않고 시간표 만들기'}
            </button>
          </BottomSheet.Footer>
        </BottomSheet>
      )}
    </ActivityLayout>
  );
};
