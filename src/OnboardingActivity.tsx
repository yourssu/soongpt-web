import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

const OnboardingActivity: ActivityComponentType = () => {
  return (
    <AppScreen appBar={{ title: 'Onboarding Activity' }}>
      <div className="flex">Onboarding Activity</div>
    </AppScreen>
  );
};

export default OnboardingActivity;
