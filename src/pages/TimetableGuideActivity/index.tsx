import { useFlow } from '@stackflow/react/future';

import { PostHog } from '@/bootstrap/posthog';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { FLOW_PROGRESS } from '@/stackflow/progress';

export const TimetableGuideActivity = () => {
  const { pop } = useFlow();

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.timetable_guide} />
          <ActivityHeaderText
            description={
              <>
                * 두 개 이상의 과목의 강의 시간이 겹쳐요.
                <br />* 과목을 삭제하거나 다시 담아봐요!
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

        <ActivityLayout.Body className="pb-[180px]" />

        <ActivityLayout.Footer>
          <ActivityActionButton
            onClick={() => {
              PostHog.trackActivityCtaClicked('timetable_guide', 'back_to_course_selection');
              pop();
            }}
            size="large"
            type="button"
          >
            과목 다시 담으러 가기
          </ActivityActionButton>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
