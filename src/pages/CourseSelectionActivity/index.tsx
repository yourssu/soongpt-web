import { ActivityComponentType } from '@stackflow/react';
import { Suspense, useState } from 'react';
import { SwitchCase } from 'react-simplikit';

import { Mixpanel } from '@/bootstrap/mixpanel';
import SoongptErrorBoundary from '@/components/SoongptErrorBoundary';
import { CourseTypeContext } from '@/contexts/CourseTypeContext';
import { useFilterCoursesByCategory } from '@/hooks/useFilterCoursesByCategory';
import { useTotalPointsByCategory } from '@/hooks/useFilterCreditByCategory';
import CourseSelectionFallback from '@/pages/CourseSelectionActivity/components/CourseSelectionFallback';
import { CourseSelectionResultStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseSelectionResultStep';
import { GeneralRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/GeneralRequiredSelectionStep';
import { MajorElectiveSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorElectiveSelectionStep';
import { MajorRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorRequiredSelectionStep';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { SelectedCourseType } from '@/pages/CourseSelectionActivity/type';
import { useFlow, useStepFlow } from '@/stackflow';
import { CourseSelectionStepType } from '@/types/course';

interface CourseSelectionActivityParams {
  type?: CourseSelectionStepType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const type = params.type ?? 'MAJOR_REQUIRED';

  const [selectedCourses, setSelectedCourses] = useState<SelectedCourseType[]>([]);

  const { push } = useFlow();
  const { stepPush } = useStepFlow('CourseSelectionActivity');

  const filteredCoursesByCategory = useFilterCoursesByCategory(selectedCourses);
  const totalPointsByCategory = useTotalPointsByCategory(selectedCourses);

  // Todo: 전필은 로딩시 무조건 선택되어야 함

  return (
    <CourseTypeContext.Provider value={type}>
      <SelectedCoursesContext.Provider
        value={{ selectedCourses, selectedCredit: totalPointsByCategory.total, setSelectedCourses }}
      >
        <SoongptErrorBoundary
          FallbackComponent={<CourseSelectionFallback type="error" />}
          progress={50}
        >
          <Suspense fallback={<CourseSelectionFallback type="pending" />}>
            <SwitchCase
              caseBy={{
                MAJOR_REQUIRED: () => (
                  <MajorRequiredSelectionStep
                    onNextClick={() => {
                      stepPush({
                        type: 'GENERAL_REQUIRED',
                      });
                      Mixpanel.trackRequiredCourseSelectionClick({
                        type: 'MAJOR_REQUIRED',
                        courses: filteredCoursesByCategory.MAJOR_REQUIRED.map(
                          (course) => course.name,
                        ),
                      });
                    }}
                  />
                ),
                GENERAL_REQUIRED: () => (
                  <GeneralRequiredSelectionStep
                    onNextClick={() => {
                      stepPush({
                        type: 'MAJOR_ELECTIVE',
                      });
                      Mixpanel.trackRequiredCourseSelectionClick({
                        type: 'GENERAL_REQUIRED',
                        courses: filteredCoursesByCategory.GENERAL_REQUIRED.map(
                          (course) => course.name,
                        ),
                      });
                    }}
                  />
                ),
                MAJOR_ELECTIVE: () => (
                  <MajorElectiveSelectionStep
                    onNextClick={() => {
                      stepPush({
                        type: 'COURSE_SELECTION_RESULT',
                      });
                      Mixpanel.trackMajorElectiveCourseSelectionClick({
                        courses: filteredCoursesByCategory.MAJOR_ELECTIVE.map(
                          (course) => course.name,
                        ),
                        otherGradeCourses: [],
                      });
                    }}
                  />
                ),
                // Todo: 검색뷰 및 액티비티 푸시
                COURSE_SELECTION_RESULT: () => (
                  <CourseSelectionResultStep
                    onNextClick={() => {
                      push('DesiredCreditActivity', {
                        generalRequiredCodes: filteredCoursesByCategory.GENERAL_REQUIRED.map(
                          ({ code }) => code,
                        ),
                        majorElectiveCodes: filteredCoursesByCategory.MAJOR_ELECTIVE.map(
                          ({ code }) => code,
                        ),
                        majorRequiredCodes: filteredCoursesByCategory.MAJOR_REQUIRED.map(
                          ({ code }) => code,
                        ),
                        selectedTotalPoints: totalPointsByCategory.total,
                        codes: selectedCourses
                          .filter((course) => !!course.selectedBySearch)
                          .map((course) => course.code),
                      });
                      Mixpanel.trackCourseSelectionFinishClick(
                        selectedCourses.map((course) => course.name),
                      );
                    }}
                  />
                ),
              }}
              value={type}
            />
          </Suspense>
        </SoongptErrorBoundary>
      </SelectedCoursesContext.Provider>
    </CourseTypeContext.Provider>
  );
};

export default CourseSelectionActivity;
