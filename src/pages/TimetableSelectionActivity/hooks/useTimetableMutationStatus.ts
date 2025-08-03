import { MutationStatus } from '@tanstack/react-query';
import { useMemo } from 'react';

import { TimetableMutationState } from '@/pages/TimetableSelectionActivity/type';
import { handleError } from '@/utils/error';
import { getKyHTTPErrorRange } from '@/utils/ky';

export const useTimetableMutationStatus = (mutationState: TimetableMutationState) => {
  return useMemo(() => {
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
  }, [mutationState]);
};
