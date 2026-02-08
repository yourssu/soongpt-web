import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { MinorCreditProgress } from '@/types/creditProgress';

export const getMinorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<MinorCreditProgress> => {
  const response = await api.get('courses/minor/credit-progress', { searchParams }).json();
  return response as MinorCreditProgress;
};
