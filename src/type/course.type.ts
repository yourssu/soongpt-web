export type CourseType = 'majorRequired' | 'generalRequired' | 'majorElective';

export interface CourseSelection {
  title: string;
  description: string;
  next: CourseType | null;
  progress: number;
  okText: string;
  courses: Course[];
}

export interface Course {
  courseId: string;
  name: string;
  professors: string[];
  credit: number;
}
