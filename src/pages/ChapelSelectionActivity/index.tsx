import { useFlow } from '@stackflow/react/future';
import { Suspense, useMemo, useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import { useLatestTimetableMutationState } from '@/hooks/timetable/useLatestTimetableMutationState';
import { ChapelCourseList } from '@/pages/ChapelSelectionActivity/components/ChapelCourseList';
import { ChapelCourseListFallback } from '@/pages/ChapelSelectionActivity/components/ChapelCourseListFallback';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { cn } from '@/utils/dom';
import { mergeTimetableCourses, toTimetableCourse } from '@/utils/timetableSelection';

export const ChapelSelectionActivity = () => {
  const { push } = useFlow();
  const { timetableId } = useSafeActivityParams('chapel_selection');
  const {
    selectedTimetable,
    selectedGeneralElectives,
    selectedChapelCourse,
    setSelectedChapelCourse,
  } = useSelectedTimetableContext();

  const latestMutation = useLatestTimetableMutationState();

  const baseTimetable = useMemo(() => {
    const timetables = latestMutation?.data?.result?.timetables ?? [];
    if (selectedTimetable) {
      return selectedTimetable;
    }

    if (timetables.length === 0) {
      return undefined;
    }

    if (!timetableId) {
      return timetables[0];
    }

    return timetables.find((timetable) => timetable.timetableId === timetableId) ?? timetables[0];
  }, [latestMutation?.data?.result?.timetables, selectedTimetable, timetableId]);

  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const previewTimetable = useMemo(
    () =>
      baseTimetable
        ? mergeTimetableCourses(baseTimetable, selectedGeneralElectives, selectedChapelCourse)
        : undefined,
    [baseTimetable, selectedChapelCourse, selectedGeneralElectives],
  );

  const isExpanded = sheetState === 'open';

  const handleCTA = () => {
    if (!isExpanded) {
      setSheetState('open');
      return;
    }

    push('timetable_result', {
      timetableId: selectedTimetable?.timetableId ?? baseTimetable?.timetableId ?? 0,
    });
  };

  const ctaDisabled = !baseTimetable;
  const ctaLabel = isExpanded ? '시간표 완성하기' : '채플 담으러 가기';

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.chapel_selection} />
        </ActivityLayout.Header>

        <ActivityLayout.Body className="relative">
          <div className="flex w-full max-w-[303px] flex-col gap-6 pb-[240px]">
            <div className="text-neutral flex flex-col gap-4">
              <h2 className="text-[24px]/[24px] font-semibold whitespace-pre-wrap">
                26-1에 이수할
                <br />
                채플 과목을 담아주세요!
              </h2>
              <p className="text-sm font-light">
                * 채플 <span className="font-medium">6회 중 4회</span> 이수했어요.
              </p>
            </div>

            <div className="w-full">
              {previewTimetable ? (
                <Timetable isSelected={false} timetable={previewTimetable} />
              ) : (
                <Timetable.Skeleton />
              )}
            </div>
          </div>

          <BottomSheet
            className={cn(
              'bg-background flex h-[520px] w-full max-w-[391px] flex-col items-center rounded-t-[24px] px-6 pb-10 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)]',
              !isExpanded && 'overflow-hidden',
            )}
            containerClassName="fixed inset-x-0 bottom-0 z-[90] flex justify-center"
            dragElastic={0.2}
            getNextState={({ info }) => {
              const shouldCollapse = info.offset.y > 60 || info.velocity.y > 700;
              return shouldCollapse ? 'peek' : 'open';
            }}
            handleWrapperClassName="w-full flex-col pb-2 pt-4"
            onHandleClick={() => setSheetState((prev) => (prev === 'open' ? 'peek' : 'open'))}
            onStateChange={setSheetState}
            onWheel={(event) => {
              if (!isExpanded && event.deltaY < 0) {
                setSheetState('open');
              }
            }}
            peekHeight={180}
            state={sheetState}
          >
            <div className="flex w-full flex-col gap-6">
              <div className="flex items-center gap-2 text-[20px]/[24px] font-semibold">
                <span className="bg-brandPrimary inline-flex size-4 rounded-full" />
                채플 과목
              </div>

              <Suspense fallback={<ChapelCourseListFallback />}>
                <ChapelCourseList
                  isExpanded={isExpanded}
                  onSelect={(course) => setSelectedChapelCourse(toTimetableCourse(course))}
                  selectedCode={selectedChapelCourse?.code}
                />
              </Suspense>

              <button
                className={cn(
                  'h-14 w-full rounded-2xl text-base font-semibold text-white transition-colors',
                  ctaDisabled ? 'text-text-buttonDisabled bg-bg-buttonDisabled' : 'bg-brandPrimary',
                )}
                disabled={ctaDisabled}
                onClick={handleCTA}
                type="button"
              >
                {ctaLabel}
              </button>
            </div>
          </BottomSheet>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
