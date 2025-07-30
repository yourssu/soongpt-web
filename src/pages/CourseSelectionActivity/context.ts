import { createContext, Dispatch, SetStateAction } from 'react';

import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';

interface SelectedCoursesContextType {
  selectedCourses: SelectedCourseType[];
  selectedCredit: number;
  setSelectedCourses: Dispatch<SetStateAction<SelectedCourseType[]>>;
}

export const SelectedCoursesContext = createContext<SelectedCoursesContextType>({
  selectedCourses: [],
  selectedCredit: 0,
  setSelectedCourses: () => {},
});
