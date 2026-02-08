import { z } from 'zod/v4';

import { ResponseSchema } from '@/schemas/response';

export const TimetableFinalizeSchema = z.object({
  saved: z.boolean(),
});
export type TimetableFinalizeType = z.infer<typeof TimetableFinalizeSchema>;

export const TimetableFinalizeResponseSchema = ResponseSchema(TimetableFinalizeSchema);
export type TimetableFinalizeResponseType = z.infer<typeof TimetableFinalizeResponseSchema>;

export type TimetableFinalizeResponseInputType = z.input<typeof TimetableFinalizeResponseSchema>;
