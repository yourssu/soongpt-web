import { useFlow } from '@stackflow/react/future';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import { useLatestTimetableMutationState } from '@/hooks/timetable/useLatestTimetableMutationState';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { mergeTimetableCourses } from '@/utils/timetableSelection';

export const TimetableResultActivity = () => {
  const { timetableId } = useSafeActivityParams('timetable_result');
  const { replace } = useFlow();
  const { selectedTimetable, selectedGeneralElectives, selectedChapelCourse } =
    useSelectedTimetableContext();
  const latestMutation = useLatestTimetableMutationState();

  const timetables = latestMutation?.data?.result.timetables ?? [];
  const timetableFromMutation = timetables.find(
    (timetable) => timetable.timetableId === timetableId,
  );
  const baseTimetable = selectedTimetable ?? timetableFromMutation;

  if (!baseTimetable) {
    replace('landing', {}, { animate: false });
    return undefined;
  }

  const timetableToRender =
    selectedGeneralElectives.length > 0 || selectedChapelCourse
      ? mergeTimetableCourses(baseTimetable, selectedGeneralElectives, selectedChapelCourse)
      : baseTimetable;

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_result} />
        </ActivityLayout.Header>
        <ActivityLayout.Body className="gap-7">
          <div className="flex w-full max-w-[300px] flex-col gap-4">
            <h2 className="text-[24px]/[24px] font-semibold tracking-[-0.48px] whitespace-pre-wrap">
              완성된 26-1 시간표에요!
              <br />
              마음에 드시나요?
            </h2>
            <p className="text-sm font-light tracking-[-0.28px]">
              * 완성된 26-1 시간표와 숭피티가 마음에 든다면
              <br />
              추천인 이벤트에 참여해보세요 :)
            </p>
          </div>
          <div className="w-full max-w-[303px] overflow-hidden rounded-xl">
            <div className="max-h-[417px] overflow-y-auto">
              <Timetable isSelected timetable={timetableToRender} />
            </div>
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
      <ActivityLayout.Footer>
        <button
          className="bg-brandPrimary h-14 w-full rounded-2xl text-base font-semibold text-white"
          type="button"
        >
          추천인 이벤트 참여하기
        </button>
      </ActivityLayout.Footer>
    </ActivityLayout>
  );
};
