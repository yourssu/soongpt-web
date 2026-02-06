import { useContext, useMemo } from 'react';

import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import { CourseBySelectedGradesEmpty } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseBySelectedGradesEmpty';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { useSuspenseGetCreditProgress } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCreditProgress';
import { CourseType } from '@/schemas/courseSchema';
import { COURSE_SELECTION_PROGRESS } from '@/stackflow/progress';

type MajorRequiredSelectionStepProps = BaseStepProps;

export const MajorRequiredSelectionStep = ({ onNextClick }: MajorRequiredSelectionStepProps) => {
  const courses = useSuspenseGetCourses('MAJOR_REQUIRED');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const { grade } = useAssertedStudentInfoContext();
  const creditProgress = useSuspenseGetCreditProgress('MAJOR_REQUIRED');

  // 권장 이수 학년이 지난 과목 개수 계산
  const overdueRecommendedCount = useMemo(() => {
    return courses.filter(
      (course) => course.recommendedGrade !== undefined && course.recommendedGrade < grade,
    ).length;
  }, [courses, grade]);

  const renderNote = (course: CourseType) => {
    if (course.recommendedGrade !== undefined) {
      return `권장 이수 학년 : ${course.recommendedGrade}학년`;
    }
    return undefined;
  };

  const { description, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header
        description={description}
        progress={COURSE_SELECTION_PROGRESS.MAJOR_REQUIRED}
        title={title}
      />

      <CourseSelectionLayout.Body>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
            <span className="text-xl font-semibold">전공필수 과목</span>
          </div>
          <div className="text-sm font-light">
            * 전공필수{' '}
            <span className="font-semibold">
              {creditProgress.totalCredits}학점 중 {creditProgress.completedCredits}학점
            </span>{' '}
            이수했어요.
            {overdueRecommendedCount > 0 && (
              <span className="text-sm font-light text-[#FF474A]">
                <br /> * 권장 이수 학년이 지난 과목이 {overdueRecommendedCount}개 있어요.
              </span>
            )}
          </div>
        </div>

        {courseState === 'EMPTY' ? (
          <CourseBySelectedGradesEmpty />
        ) : (
          <CourseSelectionList courses={courses} renderNote={renderNote} />
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
    title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    primaryButtonText: '전공선택 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이 없어요.',
    primaryButtonText: '전공선택 과목 담으러 가기',
  },
};
