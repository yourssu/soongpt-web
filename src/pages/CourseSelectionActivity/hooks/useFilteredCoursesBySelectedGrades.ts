import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { Course } from '@/schemas/courseSchema';
import { Grade } from '@/schemas/studentSchema';

interface UseFilteredCoursesBySelectedGradesProps {
  courses: Course[];
  selectedGrades: Grade[];
}

export const useFilteredCoursesBySelectedGrades = ({
  courses,
  selectedGrades,
}: UseFilteredCoursesBySelectedGradesProps) => {
  const {
    context: { department },
  } = StudentMachineContext.useSelector((state) => state);

  const courseTargetTemplates = selectedGrades.map((grade) => `${department}${grade}`);

  const isIncludeAnySelectedGrades = ({ target }: Course) => {
    return target.some((target) => courseTargetTemplates.includes(target));
  };

  return courses.filter(isIncludeAnySelectedGrades);
};
