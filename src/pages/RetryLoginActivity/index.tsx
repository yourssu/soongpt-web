import { ActivityLayout } from '@/components/ActivityLayout';

export const RetryLoginActivity = () => {
  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className="justify-center gap-4">
          <div className="text-brandPrimary text-2xl font-semibold">로그인이 필요해요</div>
          <div className="text-neutralTextSecondary text-center text-lg font-medium">
            유세인트 토큰이 만료되었어요. 다시 로그인해주세요.
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
