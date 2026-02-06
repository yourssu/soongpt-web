import { MutationStatus } from '@tanstack/react-query';

export type TimetableMutationErrorStatus = 'error400' | 'error500';

export type TimetableMutationBaseStatus = Exclude<MutationStatus, 'error'>;

export type TimetableMutationStatus = TimetableMutationBaseStatus | TimetableMutationErrorStatus;
