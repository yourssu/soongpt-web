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

type MajorRequiredSelectionStepProps = BaseStepProps;

export const MajorRequiredSelectionStep = ({ onNextClick }: MajorRequiredSelectionStepProps) => {
  const courses = useSuspenseGetCourses('MAJOR_REQUIRED');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);

  const { description, image, buttonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <CourseSelectionList courses={courses} />
        </CourseSelectionLayout.Body>
      )}

      <CourseSelectionLayout.Footer
        buttonProps={{ children: buttonText, onClick: onNextClick }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    buttonText: '확인했어요',
  },
  EMPTY: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이 없어요.',
    image: '/images/like.webp',
    buttonText: '확인했어요',
  },
};
