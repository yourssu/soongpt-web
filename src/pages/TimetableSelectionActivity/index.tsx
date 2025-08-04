import { useFlow } from '@stackflow/react/future';

import { TimetableActivityView } from '@/pages/TimetableSelectionActivity/components/TimetableActivityView';
import { useLatestTimetableMutationState } from '@/pages/TimetableSelectionActivity/hooks/useLatestTimetableMutationState';

export const TimetableSelectionActivity = () => {
  const { replace } = useFlow();

  const latestMutation = useLatestTimetableMutationState();

  if (!latestMutation) {
    replace('onboarding', {}, { animate: false });
    return undefined;
  }

  return <TimetableActivityView mutationState={latestMutation} />;
};
