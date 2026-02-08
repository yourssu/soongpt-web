import { useFlow } from '@stackflow/react/future';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { FLOW_PROGRESS } from '@/stackflow/progress';

export const TimetableGuideActivity = () => {
  const { pop } = useFlow();

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_guide} />
          <div className="mt-6 flex flex-1 flex-col items-start">
            <h2 className="text-[24px]/[normal] font-semibold">
              지금까지 선택한 과목들로는
              <br />
              시간표를 만들 수 없어요ㅠㅠ
            </h2>
            <span className="text-neutralSubtle mt-2 text-sm font-light">
              * 두 개 이상의 과목의 강의 시간이 겹쳐요.
              <br />* 과목을 삭제하거나 다시 담아봐요!
            </span>
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body className="pb-[180px]" />

        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary h-14 w-full rounded-2xl text-[16px] font-semibold text-white"
            onClick={() => pop()}
            type="button"
          >
            과목 다시 담으러 가기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
