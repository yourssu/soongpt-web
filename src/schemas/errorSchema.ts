import { z } from 'zod';

export const soongptErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  timestamp: z.string().transform((s) => new Date(s)),
});

export type SoongptErrorResponse = z.input<typeof soongptErrorSchema>;
export type SoongptError = z.output<typeof soongptErrorSchema>;
