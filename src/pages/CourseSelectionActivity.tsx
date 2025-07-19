import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { AnimatePresence } from 'motion/react';
import { Suspense } from 'react';

import AppBar from '@/components/AppBar';
import CourseSelection from '@/components/CourseSelection/CourseSelection';
import CourseSelectionFallback from '@/components/CourseSelection/CourseSelectionFallback';
import SoongptErrorBoundary from '@/components/SoongptErrorBoundary';
import { CourseTypeContext } from '@/context/CourseTypeContext';
import { CourseType } from '@/types/course';
import { courseSelectionInfo } from '@/types/courseSelectionInfo';

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
            <SoongptErrorBoundary FallbackComponent={<CourseSelectionFallback type={'error'} />}>
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
