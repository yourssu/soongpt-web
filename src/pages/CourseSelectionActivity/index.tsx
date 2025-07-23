import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { AnimatePresence } from 'motion/react';
import { Suspense, useState } from 'react';
import { SwitchCase } from 'react-simplikit';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import SoongptErrorBoundary from '@/components/SoongptErrorBoundary';
import { CourseTypeContext } from '@/contexts/CourseTypeContext';
import CourseSelectionFallback from '@/pages/CourseSelectionActivity/components/CourseSelectionFallback';
import { CourseSelectionResultStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/CourseSelectionResultStep';
import { GeneralRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/GeneralRequiredSelectionStep';
import { MajorElectiveSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorElectiveSelectionStep';
import { MajorRequiredSelectionStep } from '@/pages/CourseSelectionActivity/components/CourseSelectionSteps/MajorRequiredSelectionStep';
import { SelectedCoursesContext } from '@/pages/CourseSelectionActivity/context';
import { Course } from '@/schemas/courseSchema';
import { useStepFlow } from '@/stackflow';
import { CourseSelectionStepType } from '@/types/course';

interface CourseSelectionActivityParams {
  type?: CourseSelectionStepType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const type = params.type ?? 'MAJOR_REQUIRED';

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const selectedCredit = selectedCourses.reduce((acc, course) => acc + course.credit, 0);

  const { stepPush } = useStepFlow('CourseSelectionActivity');

  // Todo: 전필은 로딩시 무조건 선택되어야 함

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <CourseTypeContext.Provider value={type}>
          <SelectedCoursesContext.Provider
            value={{ selectedCourses, selectedCredit, setSelectedCourses }}
          >
            <div className="flex max-h-dvh min-h-dvh flex-col gap-6 py-6">
              <ProgressAppBar progress={50} />
              <SoongptErrorBoundary FallbackComponent={<CourseSelectionFallback type="error" />}>
                <Suspense fallback={<CourseSelectionFallback type="pending" />}>
                  <SwitchCase
                    caseBy={{
                      MAJOR_REQUIRED: () => (
                        <MajorRequiredSelectionStep
                          onNextClick={(courses) => {
                            stepPush({
                              type: 'GENERAL_REQUIRED',
                            });
                            Mixpanel.trackCourseSelectionClick(
                              'MAJOR_REQUIRED',
                              courses.map((course) => course.courseName),
                            );
                          }}
                        />
                      ),
                      GENERAL_REQUIRED: () => (
                        <GeneralRequiredSelectionStep
                          onNextClick={(courses) => {
                            stepPush({
                              type: 'MAJOR_ELECTIVE',
                            });
                            Mixpanel.trackCourseSelectionClick(
                              'GENERAL_REQUIRED',
                              courses.map((course) => course.courseName),
                            );
                          }}
                        />
                      ),
                      MAJOR_ELECTIVE: () => (
                        <MajorElectiveSelectionStep
                          onNextClick={(courses) => {
                            stepPush({
                              type: 'COURSE_SELECTION_RESULT',
                            });
                            Mixpanel.trackCourseSelectionClick(
                              'MAJOR_ELECTIVE',
                              courses.map((course) => course.courseName),
                            );
                          }}
                        />
                      ),
                      // Todo: 검색뷰 및 액티비티 푸시
                      COURSE_SELECTION_RESULT: () => (
                        <CourseSelectionResultStep onNextClick={() => {}} />
                      ),
                    }}
                    value={type}
                  />
                </Suspense>
              </SoongptErrorBoundary>
            </div>
          </SelectedCoursesContext.Provider>
        </CourseTypeContext.Provider>
      </AnimatePresence>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
