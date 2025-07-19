import { CourseClassification } from '@/schemas/courseSchema';
import { ArrayState } from '@/types/common';

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
