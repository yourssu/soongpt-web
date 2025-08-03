import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '@stackflow/react/future';

import { TimetableActivityView } from '@/pages/TimetableSelectionActivity/components/TimetableActivityView';
import { useLatestTimetableMutationState } from '@/pages/TimetableSelectionActivity/hooks/useLatestTimetableMutationState';

export const TimetableSelectionActivity: ActivityComponentType = () => {
  const { replace } = useFlow();

  const latestMutation = useLatestTimetableMutationState();

  if (!latestMutation) {
    replace('OnboardingActivity', {}, { animate: false });
    return undefined;
  }

  return <TimetableActivityView mutationState={latestMutation} />;
};
