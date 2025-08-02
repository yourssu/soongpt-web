import { z } from 'zod';

export const BaseResponseSchema = z.object({
  timestamp: z.string(),
});

export const BasePaginatedSchema = z.object({
  number: z.number(), // Todo: page로 바꿔야함, 백엔드 팔로업 필요
  size: z.number(),
  totalElements: z.number(),
  totalPages: z.number(),
});

export const makeResponseSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return BaseResponseSchema.extend({
    result: schema,
  });
};

export const makePaginatedSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return BasePaginatedSchema.extend({
    content: z.array(schema),
  });
};
