import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { CreditInfo } from '@/types/creditProgress';

export const getMajorPrerequisiteCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<CreditInfo> => {
  const response = await api
    .get('courses/major/prerequisite/credit-progress', { searchParams })
    .json();
  return response as CreditInfo;
};
