import { useContext } from 'react';

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
import { COURSE_SELECTION_PROGRESS } from '@/stackflow/progress';

type MajorPrerequisiteSelectionStepProps = BaseStepProps;

export const MajorPrerequisiteSelectionStep = ({
  onNextClick,
}: MajorPrerequisiteSelectionStepProps) => {
  const courses = useSuspenseGetCourses('MAJOR_PREREQUISITE');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const creditProgress = useSuspenseGetCreditProgress('MAJOR_PREREQUISITE');

  const { primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header
        progress={COURSE_SELECTION_PROGRESS.MAJOR_PREREQUISITE}
        title={title}
      />

      <CourseSelectionLayout.Body>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
            <span className="text-xl font-semibold">전공기초 과목</span>
          </div>
          <div className="text-sm font-light">
            * 전공기초{' '}
            <span className="font-semibold">
              {creditProgress.totalCredits}학점 중 {creditProgress.completedCredits}학점
            </span>{' '}
            이수했어요.
          </div>
        </div>

        {courseState === 'EMPTY' ? (
          <CourseBySelectedGradesEmpty />
        ) : (
          <CourseSelectionList courses={courses} />
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
    title: '이번 학기에 이수할\n전공기초 과목을 담아주세요!',
    primaryButtonText: '전공필수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n전공기초 과목이 없어요.',
    primaryButtonText: '전공필수 과목 담으러 가기',
  },
};
