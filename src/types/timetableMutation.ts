import { MutationState } from '@tanstack/react-query';

import { TimetableArrayResponseType } from '@/schemas/timetableSchema';

export type TimetableMutationState = MutationState<TimetableArrayResponseType>;
