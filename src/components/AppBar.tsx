import { useActivity, useStep } from '@stackflow/react';
import { ChevronLeft } from 'lucide-react';
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
        onClick={handleClickBackButton}
        className={`flex size-6 ${activity.isRoot && !step ? 'invisible' : ''}`}
      >
        <ChevronLeft />
      </button>
      <div className="flex-1">
        <ProgressBar width={progress} />
      </div>
      <div className="size-6" aria-hidden="true" />
    </div>
  );
};

export default AppBar;
