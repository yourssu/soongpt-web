import { ArrayState } from '@/hooks/useGetArrayState';

export const CourseType = ['MAJOR_REQUIRED', 'MAJOR_ELECTIVE', 'GENERAL_REQUIRED'] as const;
export type CourseType = (typeof CourseType)[number];

export const CourseClassification = [...CourseType, 'CHAPEL', 'GENERAL_ELECTIVE'] as const;
export type CourseClassification = (typeof CourseClassification)[number];

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
