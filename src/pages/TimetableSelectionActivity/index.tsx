import { ActivityComponentType } from '@stackflow/react';
import { useFlow } from '@stackflow/react/future';

import { TimetableList } from '@/pages/TimetableSelectionActivity/components/TimetableList';
import { useLatestTimetableMutationState } from '@/pages/TimetableSelectionActivity/hooks/useLatestTimetableMutationState';

export const TimetableSelectionActivity: ActivityComponentType = () => {
  const { replace } = useFlow();

  const latestMutation = useLatestTimetableMutationState();

  if (!latestMutation) {
    replace('OnboardingActivity', {}, { animate: false });
    return undefined;
  }

  return <TimetableList mutationState={latestMutation} />;
};
