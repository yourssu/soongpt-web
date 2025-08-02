import { useContext, useLayoutEffect } from 'react';

import { StudentInfoContext } from '@/components/Providers/StudentInfoProvider/context';
import { StudentType } from '@/types/student';

/**
 * 사용자 정보 입력 폼에서 사용해주세요.
 * - 폼 입력이 검증된 사용자 정보를 사용하려면 `useAssertedStudentInfoContext` 를 사용해주세요.
 * - localStorage와 연동돼요.
 */
export const useStudentInfoContext = () => {
  const context = useContext(StudentInfoContext);

  if (!context) {
    throw new Error('useStudentInfoContext는 StudentInfoContext.Provider 하위에서 사용해주세요.');
  }

  return context;
};

/**
 * 사용자 정보 입력이 완료된 상황에서 사용해주세요.
 * - 주의) 사용자 정보 입력이 완료되지 않은 상황에서 사용하면 온보딩 페이지로 이동해요.
 * - localStorage와 연동돼요.
 */
export const useAssertedStudentInfoContext = () => {
  const context = useStudentInfoContext();

  useLayoutEffect(() => {
    if (!context.studentInfo.grade || !context.studentInfo.schoolId) {
      window.location.href = '/'; // 다시 입력받을 수 있도록 온보딩 페이지로 보내요.
    }
  }, [context.studentInfo.grade, context.studentInfo.schoolId]);

  return context.studentInfo as StudentType;
};
