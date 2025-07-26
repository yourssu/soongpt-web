import { receive } from '@stackflow/compat-await-push';
import { useContext, useState } from 'react';

import { SelectableChip } from '@/components/Chip/SelectableChip';
import { ArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionChangeActionPayload } from '@/pages/CourseSearchActivity/type';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useFlow } from '@/stackflow';
import { isSameCourse } from '@/utils/course';

type SelectionTabType = '교양' | '전공';
type CourseSelectionResultStepProps = BaseStepProps;

export const CourseSelectionResultStep = ({ onNextClick }: CourseSelectionResultStepProps) => {
  const { push } = useFlow();
  const [selectionTab, setSelectionTab] = useState<SelectionTabType>('교양');
  const { selectedCourses, setSelectedCourses } = useContext(SelectedCoursesContext);

  const { description, primaryButtonText, secondaryButtonText, title } = contentMap['FILLED'];

  const onSecondaryButtonClick = async () => {
    // Todo: useReceive로 리팩토링: type-safe receive, send
    const { course, type } = await receive<CourseSelectionChangeActionPayload>(
      push('CourseSearchActivity', {
        selectedCourses,
      }),
    );
    if (type === '추가') {
      setSelectedCourses((prev) => [...prev, course]);
    } else {
      setSelectedCourses((prev) => prev.filter((c) => !isSameCourse(c, course)));
    }
  };

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header description={description} title={title} />

      <CourseSelectionLayout.Body>
        <div className="flex items-center gap-1">
          <SelectableChip
            onSelectChange={() => setSelectionTab('교양')}
            selected={selectionTab === '교양'}
          >
            교양
          </SelectableChip>
          <SelectableChip
            onSelectChange={() => setSelectionTab('전공')}
            selected={selectionTab === '전공'}
          >
            전공
          </SelectableChip>
        </div>

        <CourseSelectionList courses={selectedCourses} />
      </CourseSelectionLayout.Body>

      <CourseSelectionLayout.Footer
        primaryButtonProps={{ children: primaryButtonText, onClick: () => onNextClick([]) }}
        secondaryButtonProps={{
          children: secondaryButtonText,
          onClick: onSecondaryButtonClick,
        }}
        selectedCredit={0}
      />
    </CourseSelectionLayout>
  );
};

const contentMap: Record<ArrayState, StepContentType> = {
  FILLED: {
    title: '지금까지 선택한\n교양/전공 과목들이에요.',
    description: '과목을 추가할 수 있는 마지막 단계에요!\n필수로 수강할 과목을 모두 추가해주세요.',
    primaryButtonText: '다 선택했어요',
    secondaryButtonText: '과목 추가 할래요',
  },
  EMPTY: {
    title: '이번 학기에 이수해야 하는\n교양필수과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '다 선택했어요',
  },
};
