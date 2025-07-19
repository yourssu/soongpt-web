import { createContext } from 'react';

import { CourseType } from '@/type/course.type';

export const CourseTypeContext = createContext<CourseType>('MAJOR_REQUIRED');
