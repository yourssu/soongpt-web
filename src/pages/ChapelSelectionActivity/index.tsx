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
      <ActivityLayout.ScrollArea
        onScroll={(event) => {
          const target = event.currentTarget;
          if (target.scrollTop > 24 && !isExpanded) {
            setSheetState('open');
          }
        }}
      >
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

          <BottomSheet onStateChange={setSheetState} state={sheetState}>
            <BottomSheet.Header>
              <div className="flex items-center gap-2 text-[20px]/[24px] font-semibold">
                <span className="bg-brandPrimary inline-flex size-4 rounded-full" />
                채플 과목
              </div>
            </BottomSheet.Header>

            <BottomSheet.Body>
              <Suspense fallback={<ChapelCourseListFallback />}>
                <ChapelCourseList
                  isExpanded={isExpanded}
                  onSelect={(course) => setSelectedChapelCourse(toTimetableCourse(course))}
                  selectedCode={selectedChapelCourse?.code}
                />
              </Suspense>
            </BottomSheet.Body>

            <BottomSheet.Footer className="pt-4">
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
            </BottomSheet.Footer>
          </BottomSheet>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
