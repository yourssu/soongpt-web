import { useFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { postTimetableRecommendation } from '@/api/timetables/post-timetable-recommendation';
import { PostHog } from '@/bootstrap/posthog';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { DotSectionTitle } from '@/components/ActivityLayout/DotSectionTitle';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useToast } from '@/hooks/useToast';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { removeCodeFromPartialSelection } from '@/utils/timetablePartialSelection';

export const TimetableDeleteActivity = () => {
  const { push, pop, replace } = useFlow();
  const toast = useToast();
  const {
    selectedTimetable,
    partialSelection,
    deletableConflictCourses,
    setPartialSelection,
    setRecommendationStatus,
    setRecommendedPrimaryTimetable,
    setRecommendedAlternatives,
    setDeletableConflictCourses,
    setSelectedTimetable,
  } = useSelectedTimetableContext();

  const [selectedCode, setSelectedCode] = useState<null | number>(null);
  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const { mutateAsync: mutateTimetableRecommendation, isPending } = useMutation({
    mutationKey: ['timetables', 'final-recommendation', 'delete'],
    mutationFn: postTimetableRecommendation,
  });
  if (!selectedTimetable || !partialSelection) {
    toast.error('삭제 대상 시간표 정보가 없어 처음 화면으로 이동했어요.');
    replace('landing', {}, { animate: false });
    return null;
  }

  const handleDeleteAndCreate = async () => {
    if (selectedCode === null) {
      return;
    }
    PostHog.trackActivityCtaClicked('timetable_delete', 'delete_conflict_course_and_create', {
      selectedCourseCode: selectedCode,
    });

    const nextPartialSelection = removeCodeFromPartialSelection(partialSelection, selectedCode);
    setPartialSelection(nextPartialSelection);

    let response;
    try {
      response = await mutateTimetableRecommendation(nextPartialSelection);
    } catch {
      push('error', { message: '시간표 추천을 다시 불러오지 못했어요.' });
      return;
    }
    const { status, successResponse, singleConflictCourses } = response.result;

    setRecommendationStatus(status);

    if (status === 'SUCCESS' && successResponse) {
      setRecommendedPrimaryTimetable(successResponse.primaryTimetable);
      setRecommendedAlternatives(successResponse.alternativeSuggestions);
      setDeletableConflictCourses([]);
      setSelectedTimetable(successResponse.primaryTimetable);
      push('timetable_suggest', {});
      return;
    }

    if (status === 'SINGLE_CONFLICT') {
      setDeletableConflictCourses(singleConflictCourses ?? []);
      setSelectedCode(null);
      return;
    }

    push('timetable_guide', {});
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
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_delete} />
          <ActivityHeaderText
            description={
              <>
                * 두 개 이상의 과목의 강의 시간이 겹쳐요.
                <br />* 겹치는 과목을 삭제하면 아래 시간표를 만들 수 있어요!
              </>
            }
            descriptionClassName="text-neutralSubtle"
            title={
              <>
                지금까지 선택한 과목들로는
                <br />
                시간표를 만들 수 없어요ㅠㅠ
              </>
            }
          />
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <Timetable isSelected timetable={selectedTimetable} />
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>

      <BottomSheet onStateChange={setSheetState} peekHeight={200} state={sheetState}>
        <BottomSheet.Body>
          <div className="flex flex-col gap-4">
            <DotSectionTitle dotClassName="bg-red-500" title="시간표 생성을 위한 삭제 제안" />
            <div className="flex flex-col gap-3">
              {deletableConflictCourses.map(({ course }, index) => {
                const isSelected = selectedCode === course.code;
                return (
                  <button
                    className={`rounded-[20px] border p-4 text-left ${
                      isSelected
                        ? 'text-brandPrimary border-brandPrimary bg-white'
                        : 'border-transparent bg-white text-[#292929]'
                    }`}
                    key={`${course.code}-${index}`}
                    onClick={() =>
                      setSelectedCode((prev) => {
                        const nextValue = prev === course.code ? null : course.code;
                        PostHog.trackFieldChanged('timetable_delete_course_toggled', {
                          selected: nextValue !== null,
                          selectedCourseCode: course.code,
                        });
                        return nextValue;
                      })
                    }
                    type="button"
                  >
                    <p className="text-[16px] font-semibold">[{course.name}] 삭제</p>
                    <p className="mt-1 text-[12px] leading-[24px]">
                      [{course.name}]을(를) 삭제하면 시간표를 생성할 수 있어요! 삭제할까요?
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </BottomSheet.Body>

        <BottomSheet.Footer className="pt-4">
          <div className="flex flex-col gap-2">
            <ActivityActionButton
              onClick={() => {
                PostHog.trackActivityCtaClicked('timetable_delete', 'back_to_course_selection');
                pop();
              }}
              size="large"
              variant="secondary"
            >
              과목 다시 담으러 가기
            </ActivityActionButton>
            <ActivityActionButton
              disabled={selectedCode === null || isPending}
              onClick={handleDeleteAndCreate}
              size="large"
              type="button"
            >
              겹치는 과목 삭제하고 시간표 만들기
            </ActivityActionButton>
          </div>
        </BottomSheet.Footer>
      </BottomSheet>
    </ActivityLayout>
  );
};
