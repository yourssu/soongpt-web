import { useActivity, useStep } from '@stackflow/react';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';

import { activities, useFlow, useStepFlow } from '@/stackflow';

interface BaseAppBarProps {
  className?: string;
  onClickBackButton?: () => void;
}

export const BaseAppBar = ({
  children,
  className,
  onClickBackButton,
}: React.PropsWithChildren<BaseAppBarProps>) => {
  const activity = useActivity();
  const step = useStep();
  const { pop } = useFlow();
  const { stepPop } = useStepFlow(activity.name as keyof typeof activities);

  const hideBackButton = activity.isRoot && !step;

  const handleClickBackButton = () => {
    onClickBackButton?.();

    if (step) {
      stepPop();
      return;
    }
    pop();
  };

  return (
    <div className={clsx('grid w-full grid-cols-[24px_1fr_24px] items-center gap-4', className)}>
      <button className={clsx(hideBackButton ? 'invisible' : '')} onClick={handleClickBackButton}>
        <ChevronLeft />
      </button>
      <div className="flex">{children}</div>
      <div aria-hidden="true" />
    </div>
  );
};
