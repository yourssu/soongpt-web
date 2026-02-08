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

const TEACHING_CERTIFICATE_TABS = ['전공영역', '교직영역', '특성화'] as const;
type TeachingCertificateTab = (typeof TEACHING_CERTIFICATE_TABS)[number];

export const TeachingCertificateSelectionStep = ({ onNextClick }: BaseStepProps) => {
  const courses = useSuspenseGetCourses('TEACHING_CERTIFICATE');
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const [activeTab, setActiveTab] = useState<TeachingCertificateTab>('전공영역');
  const creditProgress = useSuspenseGetCreditProgress('TEACHING_CERTIFICATE');

  const filteredCourses = courses.filter((course) => course.subCategory === activeTab);
  const courseState = useGetArrayState(filteredCourses);

  const { primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header progress={78} title={title} />

      <CourseSelectionLayout.Body>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
            <span className="text-xl font-semibold">교직과정 과목</span>
          </div>
          <p className="flex flex-col gap-0.5 text-sm font-light">
            <span>
              * 전공영역-교과교육영역{' '}
              <span className="font-semibold">
                {creditProgress.majorArea.totalCredits}학점 중{' '}
                {creditProgress.majorArea.completedCredits}학점
              </span>{' '}
              이수했어요.
            </span>
            <span className="text-xs text-neutral-500">
              (교과교육론 2학점 이상, 교과교육 관련 교과목 6학점 이상 포함)
            </span>
            <span>
              * 교직영역{' '}
              <span className="font-semibold">
                {creditProgress.teachingArea.totalCredits}학점 중{' '}
                {creditProgress.teachingArea.completedCredits}학점
              </span>{' '}
              이수했어요.
            </span>
            <span>
              * 특성화{' '}
              <span className="font-semibold">
                {creditProgress.specialization.totalCredits}학점 중{' '}
                {creditProgress.specialization.completedCredits}학점
              </span>{' '}
              이수했어요.
            </span>
          </p>
        </div>

        <div className="flex gap-1.5">
          {TEACHING_CERTIFICATE_TABS.map((tab) => (
            <SelectableChip
              key={tab}
              onSelectChange={() => {
                PostHog.trackFieldChanged('teaching_certificate_tab_changed', {
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
    title: '이번 학기에 이수할\n교직과정 과목을 담아주세요!',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n교직과정 과목이 없어요.',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
};
