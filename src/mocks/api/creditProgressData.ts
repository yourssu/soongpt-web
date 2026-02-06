import {
  type CreditInfo,
  type DoubleMajorCreditProgress,
  type GeneralElectiveCreditProgress,
  type GeneralRequiredCreditProgress,
  type MinorCreditProgress,
  type TeachingCertificateCreditProgress,
} from '@/types/creditProgress';

export const MOCK_MAJOR_PREREQUISITE_PROGRESS: CreditInfo = {
  totalCredits: 15,
  completedCredits: 9,
};

export const MOCK_MAJOR_REQUIRED_PROGRESS: CreditInfo = {
  totalCredits: 15,
  completedCredits: 9,
};

export const MOCK_MAJOR_ELECTIVE_PROGRESS: CreditInfo = {
  totalCredits: 72,
  completedCredits: 33,
};

export const MOCK_DOUBLE_MAJOR_PROGRESS: DoubleMajorCreditProgress = {
  required: { totalCredits: 9, completedCredits: 6 },
  elective: { totalCredits: 6, completedCredits: 3 },
};

export const MOCK_MINOR_PROGRESS: MinorCreditProgress = {
  required: { totalCredits: 9, completedCredits: 6 },
  elective: { totalCredits: 6, completedCredits: 3 },
};

export const MOCK_TEACHING_CERTIFICATE_PROGRESS: TeachingCertificateCreditProgress = {
  majorArea: { totalCredits: 8, completedCredits: 6 },
  teachingArea: { totalCredits: 20, completedCredits: 3 },
  specialization: { totalCredits: 1, completedCredits: 0 },
};

export const MOCK_GENERAL_REQUIRED_PROGRESS: GeneralRequiredCreditProgress = {
  creativity: { totalCredits: 6, completedCredits: 3 },
  dignity: { totalCredits: 8, completedCredits: 7 },
  digitalTech: { totalCredits: 5, completedCredits: 3 },
};

export const MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23: GeneralElectiveCreditProgress = {
  scheme: '23+',
  requiredCredits: 9,
  completedCredits: 6,
  fieldCredits: [
    { label: '인간', completedCredits: 0 },
    { label: '문화', completedCredits: 3 },
    { label: '사회', completedCredits: 3 },
    { label: '과학', completedCredits: 0 },
    { label: 'Bridge 교과', completedCredits: 0 },
    { label: '자기개발', completedCredits: 0 },
  ],
  minFieldsRequired: 3,
};

export const MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22: GeneralElectiveCreditProgress = {
  scheme: '22-',
  requiredCourseCount: 4,
  completedCourseCount: 1,
  coreAreas: [
    { label: '숭실품성교과', completedCount: 0 },
    { label: '기초역량교과', completedCount: 0 },
  ],
  balanceAreas: [
    { label: '문학・예술', completedCount: 1 },
    { label: '역사・철학・종교', completedCount: 0 },
    { label: '정치・경제・경영', completedCount: 0 },
    { label: '사회・문화・심리', completedCount: 0 },
    { label: '자연과학・공학・기술', completedCount: 0 },
  ],
  requiredBalanceAreaCount: 2,
};
