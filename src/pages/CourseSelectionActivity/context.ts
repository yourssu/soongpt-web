import { createContext, Dispatch, SetStateAction } from 'react';

import { Course } from '@/schemas/courseSchema';

interface SelectedCoursesContextType {
  selectedCourses: Course[];
  selectedCredit: number;
  setSelectedCourses: Dispatch<SetStateAction<Course[]>>;
}

export const SelectedCoursesContext = createContext<SelectedCoursesContextType>({
  selectedCourses: [],
  selectedCredit: 0,
  setSelectedCourses: () => {},
});
