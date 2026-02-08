import { useFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { Suspense, useMemo, useState } from 'react';

import { postFinalizeTimetable } from '@/api/timetables/post-finalize-timetable';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { DotSectionTitle } from '@/components/ActivityLayout/DotSectionTitle';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useToast } from '@/hooks/useToast';
import { ChapelCourseList } from '@/pages/ChapelSelectionActivity/components/ChapelCourseList';
import { ChapelCourseListFallback } from '@/pages/ChapelSelectionActivity/components/ChapelCourseListFallback';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { hasCourseConflictWithAny } from '@/utils/timetableConflict';
import { buildPartialSelectionFromTimetable } from '@/utils/timetablePartialSelection';
import { mergeTimetableCourses, toTimetableCourse } from '@/utils/timetableSelection';

export const ChapelSelectionActivity = () => {
  const { push, replace } = useFlow();
  const toast = useToast();
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
    toast.error('채플 선택에 필요한 시간표 정보가 없어 처음 화면으로 이동했어요.');
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
          <ActivityHeaderText
            description={
              <>
                * 채플 <span className="font-medium">6회 중 4회</span> 이수했어요.
              </>
            }
            title={
              <>
                26-1에 이수할
                <br />
                채플 과목을 담아주세요!
              </>
            }
          />
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="flex w-full flex-col gap-6 pb-[240px]">
            <Timetable isSelected={false} timetable={renderedPreviewTimetable} />
          </div>

          <BottomSheet onStateChange={setSheetState} state={sheetState}>
            <BottomSheet.Header>
              <DotSectionTitle title="채플 과목" />
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
              <ActivityActionButton
                disabled={ctaDisabled}
                onClick={handleCTA}
                size="large"
                type="button"
              >
                {ctaLabel}
              </ActivityActionButton>
            </BottomSheet.Footer>
          </BottomSheet>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
