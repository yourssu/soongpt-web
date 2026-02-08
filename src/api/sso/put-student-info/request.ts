import { z } from 'zod/v4';

import { StudentGrade } from '@/types/student';

export const PutStudentInfoRequestSchema = z.object({
  grade: StudentGrade,
  semester: z.number(),
  year: z.number(),
  department: z.string(),
  doubleMajorDepartment: z.string().nullable(),
  minorDepartment: z.string().nullable(),
  teaching: z.boolean(),
});

export type PutStudentInfoRequestType = z.infer<typeof PutStudentInfoRequestSchema>;
