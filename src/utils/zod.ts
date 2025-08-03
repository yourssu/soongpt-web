import { z } from 'zod/v4';

export const isZodError = (e: any): e is z.ZodError =>
  e instanceof z.ZodError && e.name === 'ZodError';

export const getZodErrorMessage = (error: z.ZodError) => {
  return error.issues[0]?.message;
};
