import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { AnimatePresence } from 'motion/react';
import { Suspense } from 'react';
import { CourseType } from '../type/course.type.ts';
import CourseSelection from '../components/CourseSelection/CourseSelection.tsx';
import AppBar from '../components/AppBar.tsx';
import { courseSelectionInfo } from '../data/courseSelectionInfo.ts';
import { CourseTypeContext } from '../context/CourseTypeContext.ts';
import CourseSelectionFallback from '../components/CourseSelection/CourseSelectionFallback.tsx';
import SoongptErrorBoundary from '../components/SoongptErrorBoundary.tsx';

interface CourseSelectionActivityParams {
  type?: CourseType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const type = params.type ?? 'MAJOR_REQUIRED';

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <CourseTypeContext.Provider value={type}>
          <div className="flex max-h-dvh min-h-dvh flex-col gap-6 py-6">
            <AppBar progress={courseSelectionInfo[type].progress} />
            <SoongptErrorBoundary clientErrorComponent={<CourseSelectionFallback type={'error'} />}>
              <Suspense fallback={<CourseSelectionFallback type={'pending'} />}>
                <CourseSelection />
              </Suspense>
            </SoongptErrorBoundary>
          </div>
        </CourseTypeContext.Provider>
      </AnimatePresence>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
