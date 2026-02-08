import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { CreditInfo } from '@/types/creditProgress';

export const getMajorRequiredCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  const response = await api.get('courses/major/required/credit-progress', { searchParams }).json();
  return response as CreditInfo;
};
