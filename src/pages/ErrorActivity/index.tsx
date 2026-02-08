import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';

export const ErrorActivity = () => {
  const { message } = useSafeActivityParams('error');

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body variant="centered">
          <div className="text-brandPrimary text-2xl font-semibold">오류 안내</div>
          <div className="text-neutralTextSecondary text-center text-lg font-medium whitespace-pre-line">
            {message}
          </div>
        </ActivityLayout.Body>
        <ActivityLayout.Footer>
          <ActivityActionButton
            onClick={() => {
              window.location.href = '/landing';
            }}
            type="button"
          >
            처음으로 돌아가기
          </ActivityActionButton>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
