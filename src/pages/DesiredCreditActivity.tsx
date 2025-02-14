import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import AppBar from '../components/AppBar';
import SoongptErrorBoundary from '../components/SoongptErrorBoundary.tsx';
import DesireCredit from '../components/DesireCredit.tsx';

export type DesiredCreditParams = {
  majorRequired: number;
  majorElective: number;
  generalRequired: number;
  majorRequiredCourses: string[];
  majorElectiveCourses: string[];
  generalRequiredCourses: string[];
};

const DesiredCreditActivity: ActivityComponentType<DesiredCreditParams> = ({ params }) => {
  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <AppBar progress={100} />
        <SoongptErrorBoundary>
          <DesireCredit
            majorRequired={params.majorRequired}
            majorElective={params.majorElective}
            generalRequired={params.generalRequired}
            majorRequiredCourses={params.majorRequiredCourses}
            majorElectiveCourses={params.majorElectiveCourses}
            generalRequiredCourses={params.generalRequiredCourses}
          />
        </SoongptErrorBoundary>
      </div>
    </AppScreen>
  );
};

export default DesiredCreditActivity;
