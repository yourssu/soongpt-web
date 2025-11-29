import { motion } from 'motion/react';
import { SwitchCase } from 'react-simplikit';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { Timetable } from '@/components/Timetable';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import { TimetableContent } from '@/pages/TimetableSelectionActivity/components/TimetableContent';
import { TimetableError } from '@/pages/TimetableSelectionActivity/components/TimetableError';
import { TimetableList } from '@/pages/TimetableSelectionActivity/components/TimetableList';
import { useTimetableMutationState } from '@/pages/TimetableSelectionActivity/hooks/useTimetableMutationState';

export const TimetableSelectionActivity = () => {
  const { mutationStatus, timetables } = useTimetableMutationState({
    ...useAssertedStudentInfoContext(),
    ...useSafeActivityParams('timetable_selection'),
  });

  return (
    <ActivityLayout>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="flex w-full flex-1 flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        key={mutationStatus}
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
                    <TimetableList timetables={timetables ?? []} />
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
