import { ActivityLayout } from '@/components/ActivityLayout';

export const LandingActivity = () => {
  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className={'justify-center'}>
          <div className="text-brandPrimary text-[50px] font-semibold">숭피티</div>
        </ActivityLayout.Body>
        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary w-full rounded-2xl py-3.5 font-semibold text-white"
            type="button"
          >
            유세인트 로그인 하기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
