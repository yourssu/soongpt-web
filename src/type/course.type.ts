import { CourseClassification } from '../schemas/courseSchema.ts';
import { ArrayState } from './common.type.ts';

export type CourseType = Exclude<CourseClassification, 'GENERAL_ELECTIVE' | 'CHAPEL'>;

interface StateInfo {
  title: string;
  description?: string;
  okText: string;
  image?: string;
}

export interface CourseSelection {
  info: Record<ArrayState, StateInfo>;
  next: CourseType | null;
  progress: number;
}
