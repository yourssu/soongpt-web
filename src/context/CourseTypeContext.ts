import { createContext } from 'react';

import { CourseType } from '@/types/course.type';

export const CourseTypeContext = createContext<CourseType>('MAJOR_REQUIRED');
