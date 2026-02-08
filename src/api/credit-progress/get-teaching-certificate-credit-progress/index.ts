import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { TeachingCertificateCreditProgress } from '@/types/creditProgress';

export const getTeachingCertificateCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<TeachingCertificateCreditProgress> => {
  const response = await api
    .get('courses/teaching-certificate/credit-progress', { searchParams })
    .json();
  return response as TeachingCertificateCreditProgress;
};
