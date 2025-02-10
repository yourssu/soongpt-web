import { CourseClassification } from '../schemas/courseSchema.ts';

export type CourseType = Exclude<CourseClassification, 'GENERAL_ELECTIVE'>;

export interface CourseSelection {
  title: string;
  description: string;
  next: CourseType | null;
  progress: number;
  okText: string;
}
