import { useSuspenseQuery } from '@tanstack/react-query';

import api from '@/api/client';
import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useCombinedCourses } from '@/hooks/useCombinedCourses';
import { useToast } from '@/hooks/useToast';
import { CourseSelectionChangeActionPayload } from '@/pages/CourseSearchActivity/type';
import { Course, paginatedCourseResponseSchema } from '@/schemas/courseSchema';
import { isSameCourse } from '@/utils/course';

interface CourseSearchResultProps {
  onCourseSelectionChange: (payload: CourseSelectionChangeActionPayload) => void;
  searchKeyword: string;
  selectedCourses: Course[];
}

const MAX_COURSE_POINT = 25;

export const CourseSearchResult = ({
  searchKeyword,
  selectedCourses,
  onCourseSelectionChange,
}: CourseSearchResultProps) => {
  const { data: searchedCourses } = useSuspenseQuery({
    queryKey: ['searched-courses', searchKeyword],
    queryFn: async () => {
      if (searchKeyword === '') {
        return [];
      }
      const response = await api
        .get(`courses/search`, {
          searchParams: {
            q: searchKeyword,
          },
        })
        .json();
      return paginatedCourseResponseSchema.parse(response).result.content;
    },
  });
  const combinedCourses = useCombinedCourses(searchedCourses);
  const totalSelectedPoints = selectedCourses.reduce((acc, course) => acc + course.point, 0);

  const open = useAlertDialog();
  const toast = useToast();

  const onClickCourseItem = async (course: Course, isSelected: boolean) => {
    const actionType = isSelected ? '삭제' : '추가';

    const titleMap = {
      삭제: '선택한 과목을 삭제할까요?',
      추가: '선택한 과목을 추가할까요?',
    };

    const accepted = await open({
      title: titleMap[actionType],
      closeButton: false,
      closeableWithOutside: true,
      content: (
        <ul>
          <li>
            <span className="px-2">•</span>
            <span>{course.name}</span>
          </li>
        </ul>
      ),
      primaryButtonText: '네',
      secondaryButtonText: '아니요',
    });

    if (accepted) {
      if (totalSelectedPoints + course.point > MAX_COURSE_POINT) {
        toast.error(`최대 ${MAX_COURSE_POINT}학점까지만 고를 수 있어요`);
        return;
      }

      onCourseSelectionChange({ course, type: actionType });
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {combinedCourses.map((course) => {
        const isSelected = selectedCourses.some((c) => isSameCourse(c, course));
        return (
          <SelectableCourseItem
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
