import { useSuspenseQuery } from '@tanstack/react-query';

import type {
  CreditInfo,
  DoubleMajorCreditProgress,
  GeneralRequiredCreditProgress,
  MinorCreditProgress,
  TeachingCertificateCreditProgress,
} from '@/types/creditProgress';

import { getDoubleMajorCreditProgress } from '@/api/credit-progress/get-double-major-credit-progress';
import { getGeneralRequiredCreditProgress } from '@/api/credit-progress/get-general-required-credit-progress';
import { getMajorElectiveCreditProgress } from '@/api/credit-progress/get-major-elective-credit-progress';
import { getMajorPrerequisiteCreditProgress } from '@/api/credit-progress/get-major-prerequisite-credit-progress';
import { getMajorRequiredCreditProgress } from '@/api/credit-progress/get-major-required-credit-progress';
import { getMinorCreditProgress } from '@/api/credit-progress/get-minor-credit-progress';
import { getTeachingCertificateCreditProgress } from '@/api/credit-progress/get-teaching-certificate-credit-progress';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

type CreditProgressTypeMap = {
  DOUBLE_MAJOR: DoubleMajorCreditProgress;
  GENERAL_REQUIRED: GeneralRequiredCreditProgress;
  MAJOR_ELECTIVE: CreditInfo;
  MAJOR_PREREQUISITE: CreditInfo;
  MAJOR_REQUIRED: CreditInfo;
  MINOR: MinorCreditProgress;
  TEACHING_CERTIFICATE: TeachingCertificateCreditProgress;
};

export const useSuspenseGetCreditProgress = <T extends keyof CreditProgressTypeMap>(
  type: T,
): CreditProgressTypeMap[T] => {
  const { schoolId, grade, department } = useAssertedStudentInfoContext();

  const searchParams = { schoolId, grade, department };

  const { data } = useSuspenseQuery({
    queryKey: ['credit-progress', type, searchParams],
    queryFn: (async () => {
      switch (type) {
        case 'DOUBLE_MAJOR':
          return getDoubleMajorCreditProgress(searchParams);
        case 'GENERAL_REQUIRED':
          return getGeneralRequiredCreditProgress(searchParams);
        case 'MAJOR_ELECTIVE':
          return getMajorElectiveCreditProgress(searchParams);
        case 'MAJOR_PREREQUISITE':
          return getMajorPrerequisiteCreditProgress(searchParams);
        case 'MAJOR_REQUIRED':
          return getMajorRequiredCreditProgress(searchParams);
        case 'MINOR':
          return getMinorCreditProgress(searchParams);
        case 'TEACHING_CERTIFICATE':
          return getTeachingCertificateCreditProgress(searchParams);
      }
    }) as () => Promise<CreditProgressTypeMap[T]>,
    staleTime: Infinity,
  });

  return data as CreditProgressTypeMap[T];
};
