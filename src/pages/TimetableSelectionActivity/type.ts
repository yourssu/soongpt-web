import { MutationState, MutationStatus } from '@tanstack/react-query';

import { TimetableArrayResponseType } from '@/schemas/timetableSchema';

export type TimetableMutationState = MutationState<TimetableArrayResponseType>;

export type TimetableMutationStatus = 'error400' | 'error500' | Exclude<MutationStatus, 'error'>;
