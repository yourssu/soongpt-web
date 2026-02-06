import { api } from '@/api/client';
import { StudentGrade } from '@/types/student';

export const USE_MOCK = true;

// ---------------------------------------------------------------------------
// 타입 정의
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Mock 데이터
// ---------------------------------------------------------------------------
const MOCK_MAJOR_PREREQUISITE_PROGRESS: CreditInfo = {
  totalCredits: 15,
  completedCredits: 9,
};

const MOCK_MAJOR_REQUIRED_PROGRESS: CreditInfo = {
  totalCredits: 15,
  completedCredits: 9,
};

const MOCK_MAJOR_ELECTIVE_PROGRESS: CreditInfo = {
  totalCredits: 72,
  completedCredits: 33,
};

const MOCK_DOUBLE_MAJOR_PROGRESS: DoubleMajorCreditProgress = {
  required: { totalCredits: 9, completedCredits: 6 },
  elective: { totalCredits: 6, completedCredits: 3 },
};

const MOCK_MINOR_PROGRESS: MinorCreditProgress = {
  required: { totalCredits: 9, completedCredits: 6 },
  elective: { totalCredits: 6, completedCredits: 3 },
};

const MOCK_TEACHING_CERTIFICATE_PROGRESS: TeachingCertificateCreditProgress = {
  majorArea: { totalCredits: 8, completedCredits: 6 },
  teachingArea: { totalCredits: 20, completedCredits: 3 },
  specialization: { totalCredits: 1, completedCredits: 0 },
};

const MOCK_GENERAL_REQUIRED_PROGRESS: GeneralRequiredCreditProgress = {
  creativity: { totalCredits: 6, completedCredits: 3 },
  dignity: { totalCredits: 8, completedCredits: 7 },
  digitalTech: { totalCredits: 5, completedCredits: 3 },
};

const MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23: GeneralElectiveCreditProgress = {
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

const MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22: GeneralElectiveCreditProgress = {
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

// ---------------------------------------------------------------------------
// API 함수
// ---------------------------------------------------------------------------
type GetCoursesSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};

export const getMajorPrerequisiteCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<CreditInfo> => {
  if (USE_MOCK) {
    return MOCK_MAJOR_PREREQUISITE_PROGRESS;
  }

  const response = await api
    .get('courses/major/prerequisite/credit-progress', { searchParams })
    .json();
  return response as CreditInfo;
};

export const getMajorRequiredCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<CreditInfo> => {
  if (USE_MOCK) {
    return MOCK_MAJOR_REQUIRED_PROGRESS;
  }

  const response = await api.get('courses/major/required/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getMajorElectiveCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<CreditInfo> => {
  if (USE_MOCK) {
    return MOCK_MAJOR_ELECTIVE_PROGRESS;
  }

  const response = await api.get('courses/major/elective/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getDoubleMajorCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<DoubleMajorCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_DOUBLE_MAJOR_PROGRESS;
  }

  const response = await api.get('courses/major/double/credit-progress', { searchParams }).json();
  return response as DoubleMajorCreditProgress;
};

export const getMinorCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<MinorCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_MINOR_PROGRESS;
  }

  const response = await api.get('courses/minor/credit-progress', { searchParams }).json();
  return response as MinorCreditProgress;
};

export const getTeachingCertificateCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<TeachingCertificateCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_TEACHING_CERTIFICATE_PROGRESS;
  }

  const response = await api
    .get('courses/teaching-certificate/credit-progress', { searchParams })
    .json();
  return response as TeachingCertificateCreditProgress;
};

export const getGeneralRequiredCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<GeneralRequiredCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_GENERAL_REQUIRED_PROGRESS;
  }

  const response = await api
    .get('courses/general/required/credit-progress', { searchParams })
    .json();
  return response as GeneralRequiredCreditProgress;
};

export const getGeneralElectiveCreditProgress = async (
  searchParams: GetCoursesSearchParams,
): Promise<GeneralElectiveCreditProgress> => {
  if (USE_MOCK) {
    return searchParams.schoolId >= 23
      ? MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23
      : MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22;
  }

  const response = await api
    .get('courses/general/elective/credit-progress', { searchParams })
    .json();
  return response as GeneralElectiveCreditProgress;
};
