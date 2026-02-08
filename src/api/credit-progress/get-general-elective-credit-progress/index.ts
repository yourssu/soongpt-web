import { api } from '@/api/client';
import { CreditProgressSearchParams } from '@/api/credit-progress/_shared/request';
import { GeneralElectiveCreditProgress } from '@/types/creditProgress';

export const getGeneralElectiveCreditProgress = async (
  searchParams: CreditProgressSearchParams,
): Promise<GeneralElectiveCreditProgress> => {
  const response = await api
    .get('courses/general/elective/credit-progress', { searchParams })
    .json();
  return response as GeneralElectiveCreditProgress;
};
