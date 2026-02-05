import { useContext } from 'react';

import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { useCombinedCourses } from '@/hooks/course/useCombinedCourses';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseBySelectedGradesEmpty } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseBySelectedGradesEmpty';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { isSameCourse } from '@/utils/course';

type RetakeSelectionStepProps = BaseStepProps;

export const RetakeSelectionStep = ({ onNextClick }: RetakeSelectionStepProps) => {
  const courses = useSuspenseGetCourses('RETAKE');
  const courseState = useGetArrayState(courses);
  const { selectedCourses, selectedCredit, setSelectedCourses } =
    useContext(SelectedCoursesContext);
  const uniqueCourses = useCombinedCourses(courses);

  const { primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header progress={11} title={title} />

      <CourseSelectionLayout.Body>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
            <span className="text-xl font-semibold">재수강 가능 과목</span>
          </div>
          <div className="text-neutral text-sm">
            * C +이하의 성적을 받은 과목 중, <br />
            26-1에 개설된 과목만 담을 수 있어요.
          </div>
          <div className="text-neutral text-sm">* 재수강 가능 횟수는 8번이에요.</div>
        </div>

        {courseState === 'EMPTY' ? (
          <CourseBySelectedGradesEmpty />
        ) : (
          <div className="flex flex-col gap-3.5">
            {uniqueCourses.map((course) => {
              const isSelected = selectedCourses.some((sc) => isSameCourse(course, sc));

              return (
                <SelectableCourseItem
                  course={course}
                  extraBadge={
                    course.currentGrade && (
                      <div className="flex h-6 items-center rounded-lg bg-[#EAEAEA] px-2 text-[12px]/[18px] text-nowrap text-[#292929]">
                        {course.currentGrade}
                      </div>
                    )
                  }
                  isSelected={isSelected}
                  key={course.code}
                  onClickCourseItem={() => {
                    setSelectedCourses((prev) =>
                      isSelected ? prev.filter((c) => !isSameCourse(c, course)) : [...prev, course],
                    );
                  }}
                />
              );
            })}
          </div>
        )}
      </CourseSelectionLayout.Body>

      <CourseSelectionLayout.Footer
        primaryButtonProps={{ children: primaryButtonText, onClick: onNextClick }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '이번 학기에 이수할\n재수강 과목을 담아주세요!',
    primaryButtonText: '전공과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n재수강 과목이 없어요.',
    primaryButtonText: '전공과목 담으러 가기',
  },
};
