import { MutationStatus } from '@tanstack/react-query';

import { TimetableMutationState } from '@/pages/DraftTimetableActivity/type';
import { handleError } from '@/utils/error';
import { getKyHTTPErrorRange } from '@/utils/ky';

export const getTimetableMutationStatus = (mutationState: TimetableMutationState) => {
  const { status, error: unknownError } = mutationState;
  if (!unknownError) {
    return {
      status: status as Exclude<MutationStatus, 'error'>,
      handledError: undefined,
    };
  }

  const handledError = handleError(unknownError);
  if (handledError.type !== 'KyHTTPError') {
    throw handledError.error;
  }

  return {
    status:
      getKyHTTPErrorRange(handledError.error) === '500'
        ? ('error500' as const)
        : ('error400' as const),
    handledError,
  };
};
