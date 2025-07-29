import { Code } from 'lucide-react';

import { STAGE } from '@/config';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useToast } from '@/hooks/useToast';

interface ToolItemProps {
  description?: string;
  onClick: () => void;
  title: string;
}

const ToolItem = ({ title, description, onClick }: ToolItemProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col">
        <div className="text-[15px] font-semibold">{title}</div>
        {description && <span className="text-neutralSubtle text-[13px]">{description}</span>}
      </div>
      <button
        className="bg-brandPrimary cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white"
        onClick={onClick}
      >
        실행
      </button>
    </div>
  );
};

export const Devtools = () => {
  const open = useAlertDialog();
  const toast = useToast();

  const showDevtools = () => {
    open({
      title: 'Devtools (알파)',
      content: (
        <>
          <div className="flex w-full flex-col items-center justify-between gap-5">
            <ToolItem
              description="온보딩에서 입력했던 정보를 초기화해요."
              onClick={() => {
                localStorage.removeItem('student');
                toast.success('사용자 정보가 초기화되었어요.');
              }}
              title="사용자 정보 초기화"
            />
            <ToolItem
              description="온보딩 페이지로 돌아가요."
              onClick={() => {
                window.location.href = '/';
              }}
              title="처음 화면으로 돌아가기"
            />
          </div>
        </>
      ),
      closeButton: false,
      closeableWithOutside: true,
    });
  };

  if (STAGE === 'prod') {
    return undefined;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[1000]">
      <div
        className="bg-brandPrimary shadow-devtools cursor-pointer rounded-full p-3"
        onClick={showDevtools}
      >
        <Code className="size-6 text-white" />
      </div>
    </div>
  );
};
