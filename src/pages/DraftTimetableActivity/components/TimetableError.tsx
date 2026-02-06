import { useFlow } from '@stackflow/react/future';

import { TimetableContentLayout } from '@/pages/DraftTimetableActivity/components/TimetableContentLayout';
import { TimetableMutationErrorStatus } from '@/pages/DraftTimetableActivity/type';

interface TimetableErrorProps {
  status: TimetableMutationErrorStatus;
}

export const TimetableError = ({ status }: TimetableErrorProps) => {
  const { pop } = useFlow();

  const title = titleContentMap[status];

  return (
    <>
      <TimetableContentLayout.Header title={title} />

      <TimetableContentLayout.Body>
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex size-[170px] items-center justify-center">
            <img alt="Warning" className="object-contain" src="/images/warning.webp" width={170} />
          </div>
        </div>
      </TimetableContentLayout.Body>

      <button
        className="bg-brandPrimary sticky bottom-6 w-full rounded-2xl py-3.5 font-semibold text-white shadow-sm"
        onClick={() => pop(2)}
        type="button"
      >
        다시 만들기
      </button>
    </>
  );
};

const titleContentMap = {
  error400: '사용자님을 위한\n시간표를 찾지 못했어요..',
  error500: '현재 서버에 문제가 있어요.\n잠시 후 다시 시도해주세요.',
};
