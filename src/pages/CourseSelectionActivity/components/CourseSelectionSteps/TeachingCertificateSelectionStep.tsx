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

const TEACHING_CERTIFICATE_TABS = ['전공영역', '교직영역', '특성화'] as const;
type TeachingCertificateTab = (typeof TEACHING_CERTIFICATE_TABS)[number];

export const TeachingCertificateSelectionStep = ({ onNextClick }: BaseStepProps) => {
  const courses = useSuspenseGetCourses('TEACHING_CERTIFICATE');
  const courseState = useGetArrayState(courses);
  const { selectedCredit } = useContext(SelectedCoursesContext);
  const [activeTab, setActiveTab] = useState<TeachingCertificateTab>('전공영역');

  const filteredCourses = courses.filter((course) => course.subCategory === activeTab);

  const { image, primaryButtonText, title } = contentMap[courseState];

  return (
    <CourseSelectionLayout>
      <CourseSelectionLayout.Header progress={78} title={title} />

      {image ? (
        <CourseSelectionLayout.ImageBody image={image} />
      ) : (
        <CourseSelectionLayout.Body>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="bg-brandPrimary inline-block size-2.5 rounded-full" />
              <span className="font-semibold">교직과정 과목</span>
            </div>
            {/* TODO: 학점 정보 API 연동 후 동적으로 표시 */}
          </div>

          <div className="flex gap-1.5">
            {TEACHING_CERTIFICATE_TABS.map((tab) => (
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
    title: '이번 학기에 이수할\n교직과정 과목을 담아주세요!',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
  EMPTY: {
    title: '이번 학기에 이수할\n교직과정 과목이 없어요.',
    image: '/images/like.webp',
    primaryButtonText: '교양필수 과목 담으러 가기',
  },
};
