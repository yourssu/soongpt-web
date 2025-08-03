import { MutationState, MutationStatus } from '@tanstack/react-query';

import { TimetableArrayResponseType } from '@/schemas/timetableSchema';

export type TimetableMutationState = MutationState<TimetableArrayResponseType>;

export type TimetableMutationErrorStatus = 'error400' | 'error500';

export type TimetableMutationBaseStatus = Exclude<MutationStatus, 'error'>;

export type TimetableMutationStatus = TimetableMutationBaseStatus | TimetableMutationErrorStatus;
