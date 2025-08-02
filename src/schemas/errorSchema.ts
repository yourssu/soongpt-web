import { z } from 'zod';

import { BaseResponseSchema } from '@/schemas/response';

export const soongptErrorSchema = BaseResponseSchema.extend({
  message: z.string(),
  status: z.number(),
});

export type SoongptError = z.infer<typeof soongptErrorSchema>;
