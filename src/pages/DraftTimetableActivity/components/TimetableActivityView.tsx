import { motion } from 'motion/react';
import { useEffect } from 'react';
import { SwitchCase } from 'react-simplikit';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { Timetable } from '@/components/Timetable';
import { TimetableContent } from '@/pages/DraftTimetableActivity/components/TimetableContent';
import { TimetableError } from '@/pages/DraftTimetableActivity/components/TimetableError';
import { TimetableList } from '@/pages/DraftTimetableActivity/components/TimetableList';
import { getTimetableMutationStatus } from '@/pages/DraftTimetableActivity/hooks/useTimetableMutationStatus';
import { TimetableMutationState } from '@/types/timetableMutation';

interface TimetableActivityViewProps {
  mutationState: TimetableMutationState;
}

export const TimetableActivityView = ({ mutationState }: TimetableActivityViewProps) => {
  const { status: mutationStatus, handledError } = getTimetableMutationStatus(mutationState);

  // Mixpanel 이벤트 추적
  useEffect(() => {
    (async () => {
      if (!handledError) {
        return;
      }

      const { error, message } = handledError;

      Mixpanel.trackTimetableSelectionError({
        message: await message(),
        status: error.response.status,
      });
    })();
  }, [handledError]);

  return (
    <ActivityLayout>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="flex w-full flex-1 flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        key={mutationState.status}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ActivityLayout.ScrollArea>
          <ActivityLayout.Body>
            <ProgressAppBar progress={100} />
            <SwitchCase
              caseBy={{
                pending: () => (
                  <TimetableContent status="pending">
                    <Timetable.Skeleton className="pt-4" />
                  </TimetableContent>
                ),
                success: () => (
                  <TimetableContent status="success">
                    <TimetableList timetables={mutationState.data?.result.timetables ?? []} />
                  </TimetableContent>
                ),
                idle: () => <TimetableContent status="idle" />,
                error400: () => <TimetableError status="error400" />,
                error500: () => <TimetableError status="error500" />,
              }}
              value={mutationStatus}
            />
          </ActivityLayout.Body>
        </ActivityLayout.ScrollArea>
      </motion.div>
    </ActivityLayout>
  );
};
