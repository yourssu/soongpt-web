import { useFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { postAvailableCourses } from '@/api/timetables';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { DotSectionTitle } from '@/components/ActivityLayout/DotSectionTitle';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useToast } from '@/hooks/useToast';
import { SuggestionCard } from '@/pages/TimetableSuggestActivity/components/SuggestionCard';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { buildPartialSelectionFromTimetable } from '@/utils/timetablePartialSelection';

export const TimetableSuggestActivity = () => {
  const { push, replace } = useFlow();
  const toast = useToast();
  const {
    partialSelection,
    recommendedPrimaryTimetable,
    recommendedAlternatives,
    setSelectedTimetable,
    setPartialSelection,
    setAvailableGeneralElectives,
    setAvailableChapels,
    setSelectedGeneralElectives,
    setSelectedChapelCourse,
  } = useSelectedTimetableContext();

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<null | number>(null);
  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const { mutateAsync: mutateAvailableCourses, isPending } = useMutation({
    mutationKey: ['timetables', 'available-courses'],
    mutationFn: postAvailableCourses,
  });
  if (!recommendedPrimaryTimetable || !partialSelection) {
    toast.error('추천 시간표를 만들 정보가 부족해서 처음 화면으로 이동했어요.');
    replace('landing', {}, { animate: false });
    return null;
  }

  const selectedSuggestion =
    selectedSuggestionIndex === null ? null : recommendedAlternatives[selectedSuggestionIndex];
  const previewTimetable = selectedSuggestion?.timetable ?? recommendedPrimaryTimetable;

  const handleCtaClick = async () => {
    const nextPartialSelection = buildPartialSelectionFromTimetable(
      partialSelection,
      previewTimetable,
      {
        selectedGeneralElectiveCodes: partialSelection.selectedGeneralElectiveCodes,
        selectedChapelCode: partialSelection.selectedChapelCode,
      },
    );

    setSelectedTimetable(previewTimetable);
    setPartialSelection(nextPartialSelection);
    setSelectedGeneralElectives([]);
    setSelectedChapelCourse(null);

    let availableCourses;
    try {
      availableCourses = await mutateAvailableCourses(nextPartialSelection);
    } catch {
      toast.error('교양/채플 후보를 불러오지 못했어요.');
      return;
    }
    setAvailableGeneralElectives(availableCourses.result.generalElectives);
    setAvailableChapels(availableCourses.result.chapels);
    push('general_elective_selection', {});
    toast.default('교양선택 과목을 불러왔어요.');
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
          <ActivityHeaderText
            description={
              <>
                * 더 나은 시간표를 위한 제안이 있어요.
                <br />* 교양선택 과목은 선택한 시간표에 추가할 수 있어요!
              </>
            }
            descriptionClassName="text-neutralSubtle"
            title={
              <>
                지금까지 선택한 과목들로
                <br />
                만들어본 임시 시간표예요!
              </>
            }
          />
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <Timetable isSelected timetable={previewTimetable} />
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>

      <BottomSheet onStateChange={setSheetState} peekHeight={200} state={sheetState}>
        <BottomSheet.Body>
          <div className="flex flex-col gap-4">
            <DotSectionTitle dotClassName="bg-brandPrimary" title="더 나은 시간표를 위한 제안" />
            <div className="flex flex-col gap-3">
              {recommendedAlternatives.map((item, index) => (
                <SuggestionCard
                  index={index + 1}
                  isSelected={selectedSuggestionIndex === index}
                  item={item}
                  key={`${item.description}-${index}`}
                  onClick={() =>
                    setSelectedSuggestionIndex((prev) => (prev === index ? null : index))
                  }
                />
              ))}
              {recommendedAlternatives.length === 0 && (
                <div className="text-neutralSubtle rounded-[20px] bg-white p-4 text-sm">
                  적용 가능한 추가 제안이 없어요.
                </div>
              )}
            </div>
          </div>
        </BottomSheet.Body>

        <BottomSheet.Footer className="pt-4">
          <ActivityActionButton
            disabled={isPending}
            onClick={handleCtaClick}
            size="large"
            type="button"
          >
            {selectedSuggestion
              ? `${selectedSuggestionIndex! + 1}번 제안으로 시간표 만들기`
              : '제안 반영 없이 시간표 만들기'}
          </ActivityActionButton>
        </BottomSheet.Footer>
      </BottomSheet>
    </ActivityLayout>
  );
};
