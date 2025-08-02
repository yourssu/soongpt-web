import { useStorageState } from 'react-simplikit';

import { StudentInfoContext, StudentInfoFormType } from '@/contexts/StudentInfoContext';

export const StudentInfoProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  /* 
    기본적으로 localStorage를 사용해요. 
    - https://react-simplikit.slash.page/hooks/useStorageState.html#parameters
  */
  const [studentInfo, setStudentInfo] = useStorageState<StudentInfoFormType>('student', {
    defaultValue: {
      department: '',
      grade: undefined,
      isChapel: true,
      schoolId: undefined,
    },
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
