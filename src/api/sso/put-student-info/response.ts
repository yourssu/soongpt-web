import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import { StudentGrade } from '@/types/student';

const completedStudentInfoSchema = z.object({
  grade: StudentGrade,
  semester: z.number(),
  year: z.number(),
  department: z.string(),
  doubleMajorDepartment: z.string().nullable(),
  minorDepartment: z.string().nullable(),
  teaching: z.boolean(),
});

const completedResultSchema = z.object({
  status: z.literal('COMPLETED'),
  reason: z.nullable(z.string()),
  studentInfo: completedStudentInfoSchema,
});

const errorResultSchema = z.object({
  status: z.literal('ERROR'),
  reason: z.nullable(z.string()),
  studentInfo: z.null(),
});

export const PutStudentInfoResponseSchema = ResponseSchema(
  z.discriminatedUnion('status', [completedResultSchema, errorResultSchema]),
);

export type PutStudentInfoResponseType = z.infer<typeof PutStudentInfoResponseSchema>;
