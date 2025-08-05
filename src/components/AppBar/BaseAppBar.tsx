import { useStep } from '@stackflow/react';
import { useActivity, useFlow, useStepFlow } from '@stackflow/react/future';
import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';

import { ActivityName } from '@/stackflow/metadata';
import { cn } from '@/utils/dom';

interface BaseAppBarProps {
  className?: string;
}

export const BaseAppBar = ({ children, className }: React.PropsWithChildren<BaseAppBarProps>) => {
  const { isRoot, name: activityName } = useActivity();
  const { pop } = useFlow();
  const step = useStep();
  const { popStep } = useStepFlow(activityName as ActivityName);

  const isAnyStepPushed = !!step;
  const hideBackButton = isRoot && !isAnyStepPushed;

  const handleClickBackButton = () => {
    if (isAnyStepPushed) {
      popStep();
      return;
    }
    pop();
  };

  return (
    <div className={cn('grid w-full grid-cols-[24px_1fr_24px] items-center gap-4', className)}>
      <button className={clsx(hideBackButton ? 'invisible' : '')} onClick={handleClickBackButton}>
        <ChevronLeft />
      </button>
      <div className="flex">{children}</div>
      <div aria-hidden="true" />
    </div>
  );
};
