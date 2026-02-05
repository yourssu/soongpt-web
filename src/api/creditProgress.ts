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
