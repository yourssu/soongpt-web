import { Course } from '@/schemas/courseSchema';

export type StepContentType = {
  buttonText: string;
  description?: string;
  image?: string;
  title: string;
};

export type BaseStepProps = {
  onNextClick: (courses: Course[]) => void;
};
