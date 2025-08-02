import { z } from 'zod/v4';

import { BaseResponseSchema } from '@/schemas/response';

export const SoongptErrorSchema = BaseResponseSchema.extend({
  message: z.string(),
  status: z.number(),
});
export type SoongptErrorType = z.infer<typeof SoongptErrorSchema>;
