import { StudentGrade } from '@/types/student';

export type CreditProgressSearchParams = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
};
