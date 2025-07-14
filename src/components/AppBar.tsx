import { ChevronLeft } from 'lucide-react';

import { useActivity, useStep } from '@stackflow/react';

import { activities, useFlow, useStepFlow } from '../stackflow';
import ProgressBar from './ProgressBar';

interface AppBarProps {
  progress: number; // 0 to 100
}

const AppBar = ({ progress }: AppBarProps) => {
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
    <div className="flex items-center gap-4 px-6">
      <button
        className={`flex size-6 ${activity.isRoot && !step ? 'invisible' : ''}`}
        onClick={handleClickBackButton}
      >
        <ChevronLeft />
      </button>
      <div className="flex-1">
        <ProgressBar width={progress} />
      </div>
      <div aria-hidden="true" className="size-6" />
    </div>
  );
};

export default AppBar;
