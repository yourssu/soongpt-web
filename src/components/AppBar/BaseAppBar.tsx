import { useActivity, useStep } from '@stackflow/react';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';

import { activities, useFlow, useStepFlow } from '@/stackflow';

interface BaseAppBarProps {
  className?: string;
}

export const BaseAppBar = ({ children, className }: React.PropsWithChildren<BaseAppBarProps>) => {
  const activity = useActivity();
  const step = useStep();
  const { pop } = useFlow();
  const { stepPop } = useStepFlow(activity.name as keyof typeof activities);

  const handleClickBackButton = () => {
    if (step) {
      stepPop();
      return;
    }
    pop();
  };

  return (
    <div className={clsx('flex items-center gap-4 px-6', className)}>
      <button
        className={`flex size-6 ${activity.isRoot && !step ? 'invisible' : ''}`}
        onClick={handleClickBackButton}
      >
        <ChevronLeft />
      </button>
      <div className="flex-1">{children}</div>
      <div aria-hidden="true" className="size-6" />
    </div>
  );
};
