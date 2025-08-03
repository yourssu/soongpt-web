import { z } from 'zod/v4';

export const BaseResponseSchema = z.object({
  timestamp: z.string(),
});

export const BasePaginatedSchema = z.object({
  page: z.number(),
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const ResponseSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return BaseResponseSchema.extend({
    result: schema,
  });
};

export const PaginatedSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return BasePaginatedSchema.extend({
    content: z.array(schema),
  });
};
