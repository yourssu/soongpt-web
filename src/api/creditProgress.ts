import { api } from '@/api/client';
import {
  MOCK_DOUBLE_MAJOR_PROGRESS,
  MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23,
  MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22,
  MOCK_GENERAL_REQUIRED_PROGRESS,
  MOCK_MAJOR_ELECTIVE_PROGRESS,
  MOCK_MAJOR_PREREQUISITE_PROGRESS,
  MOCK_MAJOR_REQUIRED_PROGRESS,
  MOCK_MINOR_PROGRESS,
  MOCK_TEACHING_CERTIFICATE_PROGRESS,
} from '@/mocks/api/creditProgressData';
import {
  type CreditInfo,
  type CreditProgressSearchParams,
  type DoubleMajorCreditProgress,
  type GeneralElectiveCreditProgress,
  type GeneralRequiredCreditProgress,
  type MinorCreditProgress,
  type TeachingCertificateCreditProgress,
} from '@/types/creditProgress';

export const USE_MOCK = true;

// ---------------------------------------------------------------------------
// API 함수
// ---------------------------------------------------------------------------

export const getMajorPrerequisiteCreditProgress = async (
  searchParams: CreditProgressSearchParams,
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
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  if (USE_MOCK) {
    return MOCK_MAJOR_REQUIRED_PROGRESS;
  }

  const response = await api.get('courses/major/required/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getMajorElectiveCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  if (USE_MOCK) {
    return MOCK_MAJOR_ELECTIVE_PROGRESS;
  }

  const response = await api.get('courses/major/elective/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getDoubleMajorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<DoubleMajorCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_DOUBLE_MAJOR_PROGRESS;
  }

  const response = await api.get('courses/major/double/credit-progress', { searchParams }).json();
  return response as DoubleMajorCreditProgress;
};

export const getMinorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<MinorCreditProgress> => {
  if (USE_MOCK) {
    return MOCK_MINOR_PROGRESS;
  }

  const response = await api.get('courses/minor/credit-progress', { searchParams }).json();
  return response as MinorCreditProgress;
};

export const getTeachingCertificateCreditProgress = async (
  searchParams: CreditProgressSearchParams,
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
  searchParams: CreditProgressSearchParams,
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
  searchParams: CreditProgressSearchParams,
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
