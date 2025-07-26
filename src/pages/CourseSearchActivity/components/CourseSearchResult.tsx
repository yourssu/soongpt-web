import { useCombinedCourses } from '@/hooks/useCombinedCourses';
import { useSuspensedSearchedCoursesMock } from '@/pages/CourseSearchActivity/mocks/courses';
import { CourseSelectionChangeActionPayload } from '@/pages/CourseSearchActivity/type';
import CourseListItem from '@/pages/CourseSelectionActivity/components/CourseListItem';
import { Course } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

interface CourseSearchResultProps {
  onCourseSelectionChange: (payload: CourseSelectionChangeActionPayload) => void;
  searchKeyword: string;
  selectedCourses: Course[];
}

export const CourseSearchResult = ({
  searchKeyword,
  selectedCourses,
  onCourseSelectionChange,
}: CourseSearchResultProps) => {
  const searchedCourses = useSuspensedSearchedCoursesMock(searchKeyword);
  const combinedCourses = useCombinedCourses(searchedCourses);

  const onClickCourseItem = (course: Course, isSelected: boolean) => {
    onCourseSelectionChange({ course, type: isSelected ? '삭제' : '추가' });
  };

  return (
    <div className="mt-6 flex w-full flex-col gap-2">
      {combinedCourses.map((course) => {
        const isSelected = selectedCourses.some((c) => isSameCourse(c, course));
        return (
          <CourseListItem
            course={course}
            isSelected={isSelected}
            key={course.code}
            onClickCourseItem={() => onClickCourseItem(course, isSelected)}
          />
        );
      })}
    </div>
  );
};
