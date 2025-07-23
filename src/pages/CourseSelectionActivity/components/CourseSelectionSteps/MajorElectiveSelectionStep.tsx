import { useContext, useState } from 'react';
import { SwitchCase } from 'react-simplikit';

import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import { CourseBySelectedGradesEmpty } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseBySelectedGradesEmpty';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import GradeChip from '@/pages/CourseSelectionActivity/components/GradeChip';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useFilteredCoursesBySelectedGrades } from '@/pages/CourseSelectionActivity/hooks/useFilteredCoursesBySelectedGrades';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { Grade } from '@/schemas/studentSchema';

type MajorElectiveSelectionStepProps = BaseStepProps;

export const MajorElectiveSelectionStep = ({ onNextClick }: MajorElectiveSelectionStepProps) => {
  const state = StudentMachineContext.useSelector((state) => state);
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>([state.context.grade]);

  const courses = useSuspenseGetCourses('MAJOR_ELECTIVE');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const { description, image, buttonText, title } = contentMap[courseState];

  const filteredCoursesBySelectedGrades = useFilteredCoursesBySelectedGrades({
    courses,
    selectedGrades,
  });
  const filteredCoursesState = useGetArrayState(filteredCoursesBySelectedGrades);

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <div className="flex gap-1.5">
            {selectableGrades.map((grades) => (
              <GradeChip
                grades={grades}
                isSelected={grades.some((grade) => selectedGrades.includes(grade))}
                key={grades.join(', ')}
                onClickGradeChip={() => setSelectedGrades(grades)}
              />
            ))}
          </div>
          <SwitchCase
            caseBy={{
              FILLED: () => <CourseSelectionList courses={filteredCoursesBySelectedGrades} />,
              EMPTY: () => <CourseBySelectedGradesEmpty />,
            }}
            value={filteredCoursesState}
          />
        </CourseSelectionLayout.Body>
      )}

      <CourseSelectionLayout.Footer
        buttonProps={{ children: buttonText, onClick: () => onNextClick(courses) }}
        selectedCredit={selectedCredit}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
    description: '타학년 전공선택과목도 선택할 수 있어요.',
    buttonText: '다 선택했어요',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n전공선택과목이 없어요.',
    image: '/images/like.webp',
    buttonText: '다 선택했어요',
  },
};

const selectableGrades = [[1], [2], [3], [4, 5]] as const satisfies Grade[][];
