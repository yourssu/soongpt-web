import { useContext } from 'react';

import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';

type MajorPrerequisiteSelectionStepProps = BaseStepProps;

export const MajorPrerequisiteSelectionStep = ({
  onNextClick,
}: MajorPrerequisiteSelectionStepProps) => {
  const courses = useSuspenseGetCourses('MAJOR_PREREQUISITE');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);

  const { image, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
              <span className="font-semibold">전공기초 과목</span>
            </div>
            {/* TODO: 학점 정보 API 연동 후 동적으로 표시 */}
          </div>

          <CourseSelectionList courses={courses} />
        </CourseSelectionLayout.Body>
      )}

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
    image: '/images/like.webp',
    primaryButtonText: '전공필수 과목 담으러 가기',
  },
};
