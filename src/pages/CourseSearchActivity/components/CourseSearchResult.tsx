import { useSuspenseQuery } from '@tanstack/react-query';

import { getSearchedCourses } from '@/api/courses/get-searched-courses';
import { Mixpanel } from '@/bootstrap/mixpanel';
import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { useSend } from '@/hooks/stackflow/compat-await-push-hooks';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useToast } from '@/hooks/useToast';
import { CourseType } from '@/schemas/courseSchema';
import { isSameCourseCode } from '@/utils/course';

interface CourseSearchResultProps {
  searchKeyword: string;
}

const MAX_COURSE_POINT = 25;

export const CourseSearchResult = ({ searchKeyword }: CourseSearchResultProps) => {
  const toast = useToast();
  const open = useAlertDialog();
  const { popAndSend } = useSend<'course_search'>();
  const { selectedCourseCodes, totalSelectedPoints } = useSafeActivityParams('course_search');

  const { data: searchedCourses } = useSuspenseQuery({
    queryKey: ['searched-courses', searchKeyword],
    queryFn: () => getSearchedCourses(searchKeyword),
  });
  const combinedCourses = useCombinedCourses(searchedCourses);

  const onClickCourseItem = async (course: CourseType, isSelected: boolean) => {
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

      Mixpanel.trackSearchCourseAddClick(course.name);
      popAndSend({ course, actionType });
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {combinedCourses.map((course) => {
        const isSelected = selectedCourseCodes.some((c) => isSameCourseCode(c, course.code));
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
