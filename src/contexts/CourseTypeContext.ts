import { createContext } from 'react';

import { CourseSelectionStepType } from '@/types/course';

export const CourseTypeContext = createContext<CourseSelectionStepType>('MAJOR_REQUIRED');
