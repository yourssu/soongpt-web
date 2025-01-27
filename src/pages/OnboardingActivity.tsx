import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '../stackflow';

const OnboardingActivity: ActivityComponentType = () => {
  const { push } = useFlow();

  const handleClickButton = () => {
    push('CourseSelectionActivity', {
      title: 'Hello from Onboarding',
    });
  };

  return (
    <AppScreen appBar={{ title: 'Onboarding Activity' }}>
      <div className="flex">Onboarding Activity</div>
      <button onClick={handleClickButton}>Go to CourseSelection page</button>
    </AppScreen>
  );
};

export default OnboardingActivity;
