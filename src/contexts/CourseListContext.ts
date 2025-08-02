import { createContext } from 'react';

import { CourseType } from '@/schemas/courseSchema';

export const CourseListContext = createContext<CourseType[]>([]);
