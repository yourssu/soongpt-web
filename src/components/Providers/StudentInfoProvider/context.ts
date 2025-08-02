import { createContext, Dispatch, SetStateAction } from 'react';

import { UnfilledStudentInfoType } from '@/components/Providers/StudentInfoProvider/type';

interface StudentInfoContextProps {
  setStudentInfo: Dispatch<SetStateAction<UnfilledStudentInfoType>>;
  studentInfo: UnfilledStudentInfoType;
}

export const StudentInfoContext = createContext<StudentInfoContextProps>({
  studentInfo: {
    department: '',
    grade: undefined,
    isChapel: true,
    schoolId: undefined,
  },
  setStudentInfo: () => {},
});
