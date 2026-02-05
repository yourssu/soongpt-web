import { useContext, useState } from 'react';

import { SelectableChip } from '@/components/Chip/SelectableChip';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { CourseSelectionLayout } from '@/pages/CourseSelectionActivity/components/CourseSelectionLayout';
import { CourseSelectionList } from '@/pages/CourseSelectionActivity/components/CourseSelectionList';
import {
  BaseStepProps,
  StepContentType,
} from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/type';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { useSuspenseGetCourses } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCourses';
import { useSuspenseGetCreditProgress } from '@/pages/CourseSelectionActivity/hooks/useSuspenseGetCreditProgress';

const DOUBLE_MAJOR_TABS = ['필수', '선택'] as const;
type DoubleMajorTab = (typeof DOUBLE_MAJOR_TABS)[number];

export const DoubleMajorSelectionStep = ({ onNextClick }: BaseStepProps) => {
  const courses = useSuspenseGetCourses('DOUBLE_MAJOR');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const [activeTab, setActiveTab] = useState<DoubleMajorTab>('필수');
  const creditProgress = useSuspenseGetCreditProgress('DOUBLE_MAJOR');

  const filteredCourses = courses.filter((course) => course.subCategory === activeTab);

  const { image, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header progress={56} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
              <span className="font-semibold">복수전공 과목</span>
            </div>
            <div className="flex flex-col gap-0.5 text-sm font-light">
              <div>
                * 복수전공필수{' '}
                <span className="font-semibold">
                  {creditProgress.required.totalCredits}학점 중{' '}
                  {creditProgress.required.completedCredits}학점
                </span>
              </div>
              <div>
                * 복수전공선택{' '}
                <span className="font-semibold">
                  {creditProgress.elective.totalCredits}학점 중{' '}
                  {creditProgress.elective.completedCredits}학점
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5">
            {DOUBLE_MAJOR_TABS.map((tab) => (
              <SelectableChip
                key={tab}
                onSelectChange={() => setActiveTab(tab)}
                selected={activeTab === tab}
              >
                {tab}
              </SelectableChip>
            ))}
          </div>

          <CourseSelectionList courses={filteredCourses} />
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
    title: '이번 학기에 이수할\n복수전공 과목을 담아주세요!',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n복수전공 과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
};
