import { createContext } from 'react';

import { Course } from '../schemas/courseSchema.ts';

export const CourseListContext = createContext<Course[]>([]);
