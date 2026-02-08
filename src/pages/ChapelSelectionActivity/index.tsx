import { useFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';

import { postFinalizeTimetable } from '@/api/timetables';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { ChapelCourseList } from '@/pages/ChapelSelectionActivity/components/ChapelCourseList';
import { ChapelCourseListFallback } from '@/pages/ChapelSelectionActivity/components/ChapelCourseListFallback';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { cn } from '@/utils/dom';
import { hasCourseConflictWithAny } from '@/utils/timetableConflict';
import { buildPartialSelectionFromTimetable } from '@/utils/timetablePartialSelection';
import { mergeTimetableCourses, toTimetableCourse } from '@/utils/timetableSelection';

export const ChapelSelectionActivity = () => {
  const { push, replace } = useFlow();
  const {
    partialSelection,
    selectedTimetable,
    selectedGeneralElectives,
    selectedChapelCourse,
    setSelectedChapelCourse,
    availableChapels,
    previewTimetable,
    setPartialSelection,
    setFinalizedTimetable,
  } = useSelectedTimetableContext();

  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const { mutateAsync: mutateFinalizeTimetable, isPending } = useMutation({
    mutationKey: ['timetables', 'finalize'],
    mutationFn: postFinalizeTimetable,
  });

  const selectableChapels = useMemo(() => {
    return availableChapels.filter((course) => {
      if (selectedChapelCourse && selectedChapelCourse.code === course.code) {
        return true;
      }

      const candidate = toTimetableCourse(course);
      const occupiedCourses = [...(selectedTimetable?.courses ?? []), ...selectedGeneralElectives];
      return !hasCourseConflictWithAny(candidate, occupiedCourses);
    });
  }, [
    availableChapels,
    selectedChapelCourse,
    selectedGeneralElectives,
    selectedTimetable?.courses,
  ]);

  if (!selectedTimetable || !partialSelection) {
    replace('landing', {}, { animate: false });
    return null;
  }

  const renderedPreviewTimetable =
    previewTimetable ??
    mergeTimetableCourses(selectedTimetable, selectedGeneralElectives, selectedChapelCourse);

  const isExpanded = sheetState === 'open';

  const handleCTA = async () => {
    if (!isExpanded) {
      setSheetState('open');
      return;
    }

    const nextPartialSelection = buildPartialSelectionFromTimetable(
      partialSelection,
      renderedPreviewTimetable,
      {
        selectedGeneralElectiveCodes: selectedGeneralElectives.map((course) => course.code),
        selectedChapelCode: selectedChapelCourse?.code,
      },
    );

    setPartialSelection(nextPartialSelection);

    try {
      await mutateFinalizeTimetable({
        partialSelection: nextPartialSelection,
        timetable: renderedPreviewTimetable,
      });
    } catch {
      push('error', { message: '최종 시간표 저장에 실패했어요.' });
      return;
    }

    setFinalizedTimetable(renderedPreviewTimetable);
    push('timetable_result', {
      timetableId: renderedPreviewTimetable.timetableId,
    });
  };

  const ctaDisabled = !selectedTimetable || isPending;
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
              <Timetable isSelected={false} timetable={renderedPreviewTimetable} />
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
                  courses={selectableChapels}
                  isExpanded={isExpanded}
                  onSelect={(course) => {
                    setSelectedChapelCourse((prev) =>
                      prev && prev.code === course.code ? null : toTimetableCourse(course),
                    );
                  }}
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
