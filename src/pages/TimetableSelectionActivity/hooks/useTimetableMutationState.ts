import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { postTimetable, TimetablePayloadType } from '@/api/timetables';
import { Mixpanel } from '@/bootstrap/mixpanel';
import { useEffectOnce } from '@/hooks/useEffectOnce';
import { TimetableMutationStatus } from '@/pages/TimetableSelectionActivity/type';
import { TimetableType } from '@/schemas/timetableSchema';
import { handleError } from '@/utils/error';
import { getKyHTTPErrorRange } from '@/utils/ky';

type UseTimetableMutationStateProps = TimetablePayloadType;

export const useTimetableMutationState = (props: UseTimetableMutationStateProps) => {
  const [timetables, setTimetables] = useState<TimetableType[]>([]);
  const [mutationStatus, setMutationStatus] = useState<TimetableMutationStatus>('idle');

  const { mutate } = useMutation({
    mutationFn: postTimetable,
    onSuccess: (data) => {
      setTimetables(data.result.timetables);
      setMutationStatus('success');
      Mixpanel.incrementUserCount();
      Mixpanel.trackTimetableGenerateComplete();
    },
    onError: async (e) => {
      const { type, error, message } = handleError(e);
      if (type === 'KyHTTPError') {
        setMutationStatus(getKyHTTPErrorRange(error) === '500' ? 'error500' : 'error400');
        Mixpanel.trackTimetableSelectionError({
          message: await message(),
          status: error.response.status,
        });
      }
    },
  });

  useEffectOnce(() => {
    setMutationStatus('pending');
    mutate(props);
  });

  return {
    timetables,
    mutationStatus,
  };
};
