import { StudentGrade } from '@/types/student';

export type GetCoursesSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};
