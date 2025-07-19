import { createContext } from 'react';

import { Course } from '@/schemas/courseSchema';

export const CourseListContext = createContext<Course[]>([]);
