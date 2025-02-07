import { createContext } from 'react';
import { Course } from '../type/course.type.ts';

export const CourseListContext = createContext<Course[]>([]);
