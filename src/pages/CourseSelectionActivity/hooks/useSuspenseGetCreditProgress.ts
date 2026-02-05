import { useSuspenseQuery } from '@tanstack/react-query';

import {
  type CreditInfo,
  type DoubleMajorCreditProgress,
  type GeneralRequiredCreditProgress,
  getDoubleMajorCreditProgress,
  getGeneralRequiredCreditProgress,
  getMajorElectiveCreditProgress,
  getMajorPrerequisiteCreditProgress,
  getMajorRequiredCreditProgress,
  getMinorCreditProgress,
  getTeachingCertificateCreditProgress,
  type MinorCreditProgress,
  type TeachingCertificateCreditProgress,
} from '@/api/creditProgress';
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
