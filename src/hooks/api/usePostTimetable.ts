import { useMutation } from '@tanstack/react-query';

import { postTimetable } from '@/api/timetables';
import { Mixpanel } from '@/bootstrap/mixpanel';

export const usePostTimetable = () => {
  return useMutation({
    mutationKey: ['timetables'],
    mutationFn: postTimetable,
    onMutate: () => {
      Mixpanel.incrementUserCount();
      Mixpanel.trackTimetableGenerateComplete();
    },
  });
};
