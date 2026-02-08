import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { GeneralRequiredCreditProgress } from '@/types/creditProgress';

export const getGeneralRequiredCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<GeneralRequiredCreditProgress> => {
  const response = await api
    .get('courses/general/required/credit-progress', { searchParams })
    .json();
  return response as GeneralRequiredCreditProgress;
};
