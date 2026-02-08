import { z } from 'zod/v4';

export const CreditInfoSchema = z.object({
  completedCredits: z.number(),
  totalCredits: z.number(),
});
export type CreditInfo = z.infer<typeof CreditInfoSchema>;

export const DoubleMajorCreditProgressSchema = z.object({
  elective: CreditInfoSchema,
  required: CreditInfoSchema,
});
export type DoubleMajorCreditProgress = z.infer<typeof DoubleMajorCreditProgressSchema>;

export const MinorCreditProgressSchema = z.object({
  elective: CreditInfoSchema,
  required: CreditInfoSchema,
});
export type MinorCreditProgress = z.infer<typeof MinorCreditProgressSchema>;

export const TeachingCertificateCreditProgressSchema = z.object({
  majorArea: CreditInfoSchema,
  specialization: CreditInfoSchema,
  teachingArea: CreditInfoSchema,
});
export type TeachingCertificateCreditProgress = z.infer<
  typeof TeachingCertificateCreditProgressSchema
>;

export const GeneralRequiredCreditProgressSchema = z.object({
  creativity: CreditInfoSchema,
  digitalTech: CreditInfoSchema,
  dignity: CreditInfoSchema,
});
export type GeneralRequiredCreditProgress = z.infer<typeof GeneralRequiredCreditProgressSchema>;

export const GeneralElectiveCreditProgressSchema = z.union([
  z.object({
    balanceAreas: z.array(
      z.object({
        completedCount: z.number(),
        label: z.string(),
      }),
    ),
    completedCourseCount: z.number(),
    coreAreas: z.array(
      z.object({
        completedCount: z.number(),
        label: z.string(),
      }),
    ),
    requiredBalanceAreaCount: z.number(),
    requiredCourseCount: z.number(),
    scheme: z.literal('22-'),
  }),
  z.object({
    completedCredits: z.number(),
    fieldCredits: z.array(
      z.object({
        completedCredits: z.number(),
        label: z.string(),
      }),
    ),
    minFieldsRequired: z.number(),
    requiredCredits: z.number(),
    scheme: z.literal('23+'),
  }),
]);
export type GeneralElectiveCreditProgress = z.infer<typeof GeneralElectiveCreditProgressSchema>;
