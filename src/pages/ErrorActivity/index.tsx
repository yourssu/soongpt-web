import { ActivityLayout } from '@/components/ActivityLayout';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';

export const ErrorActivity = () => {
  const { message } = useSafeActivityParams('error');

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className="justify-center gap-4">
          <div className="text-brandPrimary text-2xl font-semibold">오류 안내</div>
          <div className="text-neutralTextSecondary text-center text-lg font-medium whitespace-pre-line">
            {message}
          </div>
        </ActivityLayout.Body>
        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary w-full rounded-2xl py-3.5 font-semibold text-white"
            onClick={() => {
              window.location.href = '/landing';
            }}
            type="button"
          >
            처음으로 돌아가기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
