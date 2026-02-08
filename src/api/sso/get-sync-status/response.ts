import { z } from 'zod/v4';

import { ResponseSchema } from '@/api/response';
import { StudentGrade } from '@/types/student';

const syncStatusStudentInfoSchema = z.object({
  grade: StudentGrade,
  semester: z.number(),
  year: z.number(),
  department: z.string(),
  doubleMajorDepartment: z.string().nullable(),
  minorDepartment: z.string().nullable(),
  teaching: z.boolean(),
});

const processingSyncStatusResultSchema = z.object({
  status: z.literal('PROCESSING'),
  reason: z.nullable(z.string()),
  studentInfo: z.null(),
});

const completedSyncStatusResultSchema = z.object({
  status: z.literal('COMPLETED'),
  reason: z.nullable(z.string()),
  studentInfo: syncStatusStudentInfoSchema,
});

const requiresReauthSyncStatusResultSchema = z.object({
  status: z.literal('REQUIRES_REAUTH'),
  reason: z.nullable(z.string()),
  studentInfo: z.null(),
});

const failedSyncStatusResultSchema = z.object({
  status: z.literal('FAILED'),
  reason: z.nullable(z.string()),
  studentInfo: z.null(),
});

const errorSyncStatusResultSchema = z.object({
  status: z.literal('ERROR'),
  reason: z.nullable(z.string()),
  studentInfo: z.null(),
});

export const syncStatusResultSchema = z.discriminatedUnion('status', [
  processingSyncStatusResultSchema,
  completedSyncStatusResultSchema,
  requiresReauthSyncStatusResultSchema,
  failedSyncStatusResultSchema,
  errorSyncStatusResultSchema,
]);

export const syncStatusSchema = ResponseSchema(syncStatusResultSchema);

export type SyncStatusResultType = z.infer<typeof syncStatusResultSchema>;
export type SyncStatusType = z.infer<typeof syncStatusSchema>;
