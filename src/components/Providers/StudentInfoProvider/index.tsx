import { useStorageState } from 'react-simplikit';

import { StudentInfoContext, StudentInfoFormType } from '@/contexts/StudentInfoContext';

export const StudentInfoProvider = ({ children }: React.PropsWithChildren<unknown>) => {
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
