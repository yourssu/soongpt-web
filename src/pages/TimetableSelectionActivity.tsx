import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import TimetableSelection from '../components/TimetableSelection/TimetableSelection.tsx';
import SoongptErrorBoundary from '../components/SoongptErrorBoundary.tsx';
import TimetableSelectionFallback from '../components/TimetableSelection/TimetableSelectionFallback.tsx';
import { Suspense } from 'react';

const TimetableSelectionActivity: ActivityComponentType = () => {
  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <AppBar progress={100} />
        <SoongptErrorBoundary clientErrorComponent={<TimetableSelectionFallback type={'error'} />}>
          <Suspense fallback={<TimetableSelectionFallback type={'pending'} />}>
            <TimetableSelection />
          </Suspense>
        </SoongptErrorBoundary>
      </div>
    </AppScreen>
  );
};

export default TimetableSelectionActivity;
