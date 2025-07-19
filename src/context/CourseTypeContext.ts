import { createContext } from 'react';

import { CourseType } from '@/types/course';

export const CourseTypeContext = createContext<CourseType>('MAJOR_REQUIRED');
