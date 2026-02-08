import { z } from 'zod/v4';

const completedSyncStatusSchema = z.object({
  status: z.literal('COMPLETED'),
  grade: z.number(),
  semester: z.number(),
  schoolId: z.number(),
  department: z.string(),
  subDepartment: z.string().optional(),
  teachTrainingCourse: z.boolean(),
});

const processingSyncStatusSchema = z.object({
  status: z.literal('PROCESSING'),
});

const failedSyncStatusSchema = z.object({
  status: z.literal('FAILED'),
  reason: z.string().optional(),
});

const requiresReauthSyncStatusSchema = z.object({
  status: z.literal('REQUIRES_REAUTH'),
  reason: z.string().optional(),
});

export const syncStatusSchema = z.discriminatedUnion('status', [
  processingSyncStatusSchema,
  completedSyncStatusSchema,
  requiresReauthSyncStatusSchema,
  failedSyncStatusSchema,
]);

export type SyncStatusType = z.infer<typeof syncStatusSchema>;
