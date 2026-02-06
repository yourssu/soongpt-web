import { StudentGrade } from '@/types/student';

export type CreditInfo = {
  completedCredits: number;
  totalCredits: number;
};

export type DoubleMajorCreditProgress = {
  elective: CreditInfo;
  required: CreditInfo;
};

export type MinorCreditProgress = {
  elective: CreditInfo;
  required: CreditInfo;
};

export type TeachingCertificateCreditProgress = {
  majorArea: CreditInfo;
  specialization: CreditInfo;
  teachingArea: CreditInfo;
};

export type GeneralRequiredCreditProgress = {
  creativity: CreditInfo;
  digitalTech: CreditInfo;
  dignity: CreditInfo;
};

export type GeneralElectiveCreditProgress =
  | {
      balanceAreas: Array<{
        completedCount: number;
        label: string;
      }>;
      completedCourseCount: number;
      coreAreas: Array<{
        completedCount: number;
        label: string;
      }>;
      requiredBalanceAreaCount: number;
      requiredCourseCount: number;
      scheme: '22-';
    }
  | {
      completedCredits: number;
      fieldCredits: Array<{
        completedCredits: number;
        label: string;
      }>;
      minFieldsRequired: number;
      requiredCredits: number;
      scheme: '23+';
    };

export type CreditProgressSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};
