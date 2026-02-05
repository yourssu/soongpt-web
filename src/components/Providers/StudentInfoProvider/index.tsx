import { useStorageState } from 'react-simplikit';

import { StudentInfoContext } from '@/components/Providers/StudentInfoProvider/context';
import { UnfilledStudentInfoType } from '@/components/Providers/StudentInfoProvider/type';

const defaultStudentInfo: UnfilledStudentInfoType = {
  department: '',
  grade: undefined,
  schoolId: undefined,
  semester: undefined,
  subDepartment: '',
  teachTrainingCourse: false,
};

export const StudentInfoProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  /* 
    기본적으로 localStorage를 사용해요. 
    - https://react-simplikit.slash.page/hooks/useStorageState.html#parameters
  */
  const [studentInfo, setStudentInfo] = useStorageState<UnfilledStudentInfoType>('student-info', {
    defaultValue: defaultStudentInfo,
  });

  return (
    <StudentInfoContext.Provider
      value={{
        studentInfo,
        setStudentInfo,
      }}
    >
      {children}
    </StudentInfoContext.Provider>
  );
};
