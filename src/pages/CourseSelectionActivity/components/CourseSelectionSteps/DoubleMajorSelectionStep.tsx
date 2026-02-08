import { useContext, useState } from 'react';

import { PostHog } from '@/bootstrap/posthog';
import { SelectableChip } from '@/components/Chip/SelectableChip';
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

const DOUBLE_MAJOR_TABS = ['필수', '선택'] as const;
type DoubleMajorTab = (typeof DOUBLE_MAJOR_TABS)[number];

export const DoubleMajorSelectionStep = ({ onNextClick }: BaseStepProps) => {
  const courses = useSuspenseGetCourses('DOUBLE_MAJOR');
  const [activeTab, setActiveTab] = useState<DoubleMajorTab>('필수');
  const filteredCourses = courses.filter((course) => course.subCategory === activeTab);
  const courseState = useGetArrayState(filteredCourses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const creditProgress = useSuspenseGetCreditProgress('DOUBLE_MAJOR');

  const { primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header
        progress={COURSE_SELECTION_PROGRESS.DOUBLE_MAJOR}
        title={title}
      />

      <CourseSelectionLayout.Body>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
            <span className="text-xl font-semibold">복수전공 과목</span>
          </div>
          <p className="flex flex-col gap-0.5 text-sm leading-tight font-light">
            <span>
              * 복수전공필수{' '}
              <span className="font-semibold">
                {creditProgress.required.totalCredits}학점 중{' '}
                {creditProgress.required.completedCredits}학점
              </span>{' '}
              이수했어요.
            </span>
            <span>
              * 복수전공선택{' '}
              <span className="font-semibold">
                {creditProgress.elective.totalCredits}학점 중{' '}
                {creditProgress.elective.completedCredits}학점
              </span>{' '}
              이수했어요.
            </span>
          </p>
        </div>

        <div className="flex gap-1.5">
          {DOUBLE_MAJOR_TABS.map((tab) => (
            <SelectableChip
              key={tab}
              onSelectChange={() => {
                PostHog.trackFieldChanged('double_major_tab_changed', {
                  tab,
                });
                setActiveTab(tab);
              }}
              selected={activeTab === tab}
            >
              {tab}
            </SelectableChip>
          ))}
        </div>

        {courseState === 'EMPTY' ? (
          <CourseBySelectedGradesEmpty />
        ) : (
          <CourseSelectionList courses={filteredCourses} />
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
    title: '이번 학기에 이수할\n복수전공 과목을 담아주세요!',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n복수전공 과목이 없어요.',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
};
