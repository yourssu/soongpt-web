import { useSuspenseQueries } from '@tanstack/react-query';

import { getMajorElectiveCourses } from '@/api/courses';
import { useAssertedStudentInfoContext } from '@/contexts/StudentInfoContext';
import { StudentGrade } from '@/types/student';

export const useSuspenseGetMajorElectives = (grades: StudentGrade[]) => {
  const { schoolId, department } = useAssertedStudentInfoContext();

  const getSearchParams = (grade: StudentGrade) => ({
    schoolId,
    department,
    grade,
  });

  const courses = useSuspenseQueries({
    queries: grades.map((grade) => {
      const searchParams = getSearchParams(grade);
      return {
        queryKey: ['MAJOR_ELECTIVE', searchParams],
        queryFn: () => getMajorElectiveCourses(searchParams),
      };
    }),
    combine: (results) => results.map((result) => result.data.result).flat(),
  });

  return courses;
};
