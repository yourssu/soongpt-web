import { StudentGrade, StudentType } from '@/types/student';
import { Merge } from '@/utils/type';

export type UnfilledStudentInfoType = Merge<
  StudentType,
  {
    grade: StudentGrade | undefined;
    schoolId: number | undefined;
  }
>;
