import { api } from '@/api/client';
import {
  type CreditInfo,
  type CreditProgressSearchParams,
  type DoubleMajorCreditProgress,
  type GeneralElectiveCreditProgress,
  type GeneralRequiredCreditProgress,
  type MinorCreditProgress,
  type TeachingCertificateCreditProgress,
} from '@/types/creditProgress';

// ---------------------------------------------------------------------------
// API 함수
// ---------------------------------------------------------------------------

export const getMajorPrerequisiteCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  const response = await api
    .get('courses/major/prerequisite/credit-progress', { searchParams })
    .json();
  return response as CreditInfo;
};

export const getMajorRequiredCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  const response = await api.get('courses/major/required/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getMajorElectiveCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  const response = await api.get('courses/major/elective/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};

export const getDoubleMajorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<DoubleMajorCreditProgress> => {
  const response = await api.get('courses/major/double/credit-progress', { searchParams }).json();
  return response as DoubleMajorCreditProgress;
};

export const getMinorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<MinorCreditProgress> => {
  const response = await api.get('courses/minor/credit-progress', { searchParams }).json();
  return response as MinorCreditProgress;
};

export const getTeachingCertificateCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<TeachingCertificateCreditProgress> => {
  const response = await api
    .get('courses/teaching-certificate/credit-progress', { searchParams })
    .json();
  return response as TeachingCertificateCreditProgress;
};

export const getGeneralRequiredCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<GeneralRequiredCreditProgress> => {
  const response = await api
    .get('courses/general/required/credit-progress', { searchParams })
    .json();
  return response as GeneralRequiredCreditProgress;
};

export const getGeneralElectiveCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<GeneralElectiveCreditProgress> => {
  const response = await api
    .get('courses/general/elective/credit-progress', { searchParams })
    .json();
  return response as GeneralElectiveCreditProgress;
};
