import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import { useFlow } from '../stackflow';

const CourseSelectionActivity: ActivityComponentType = () => {
  const { push } = useFlow();

  const handleClickButton = () => {
    push('OnboardingActivity', {});
  };

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="flex flex-col items-center">
          <div>CourseSelection Page</div>
          <button onClick={handleClickButton}>Go to Onboarding page</button>
        </div>
      </div>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
