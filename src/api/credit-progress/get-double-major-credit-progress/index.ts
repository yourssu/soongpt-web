import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { DoubleMajorCreditProgress } from '@/types/creditProgress';

export const getDoubleMajorCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<DoubleMajorCreditProgress> => {
  const response = await api.get('courses/major/double/credit-progress', { searchParams }).json();
  return response as DoubleMajorCreditProgress;
};
