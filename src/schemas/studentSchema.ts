import { z } from 'zod';

// Todo: 개선 필요
const Grade = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type Grade = z.infer<typeof Grade>;
