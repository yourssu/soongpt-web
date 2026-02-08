import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import { TimetableSchema } from '@/types/timetable';

export const TimetableArrayResponseSchema = ResponseSchema(
  z.object({
    timetables: z.array(TimetableSchema),
  }),
);
export type TimetableArrayResponseType = z.infer<typeof TimetableArrayResponseSchema>;
export type TimetableArrayResponseInputType = z.input<typeof TimetableArrayResponseSchema>;
