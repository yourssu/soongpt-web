export type StudentType = {
  department: string;
  grade: StudentGrade;
  isChapel: boolean;
  schoolId: number;
};

export const StudentGrade = [1, 2, 3, 4, 5] as const;
export type StudentGrade = (typeof StudentGrade)[number];
