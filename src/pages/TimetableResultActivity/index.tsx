import { useFlow } from '@stackflow/react/future';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { FLOW_PROGRESS } from '@/stackflow/progress';

export const TimetableResultActivity = () => {
  const { replace } = useFlow();
  const { finalizedTimetable, previewTimetable, selectedTimetable } = useSelectedTimetableContext();

  const timetableToRender = finalizedTimetable ?? previewTimetable ?? selectedTimetable;

  if (!timetableToRender) {
    replace('landing', {}, { animate: false });
    return undefined;
  }

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_result} />
        </ActivityLayout.Header>
        <ActivityLayout.Body>
          <div className="flex w-full flex-col gap-6 pb-[180px]">
            <div className="flex w-full flex-col gap-4">
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
            <Timetable isSelected={false} timetable={timetableToRender} />
          </div>
        </ActivityLayout.Body>
        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary h-14 w-full rounded-2xl text-base font-semibold text-white"
            type="button"
          >
            추천인 이벤트 참여하기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
