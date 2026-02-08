import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import { TimetableSchema } from '@/schemas/timetableSchema';

export const TimetableResponseSchema = ResponseSchema(TimetableSchema);
export type TimetableResponseType = z.infer<typeof TimetableResponseSchema>;
export type TimetableResponseInputType = z.input<typeof TimetableResponseSchema>;
