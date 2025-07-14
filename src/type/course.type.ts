import { CourseClassification } from '../schemas/courseSchema.ts';
import { ArrayState } from './common.type.ts';

export type CourseType = Exclude<CourseClassification, 'CHAPEL' | 'GENERAL_ELECTIVE'>;

interface StateInfo {
  description?: string;
  image?: string;
  okText: string;
  title: string;
}

export interface CourseSelectionInfo {
  next: CourseType | null;
  progress: number;
  text: Record<ArrayState, StateInfo>;
}
