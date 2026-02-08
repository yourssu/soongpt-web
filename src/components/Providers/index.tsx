import { OverlayProvider } from 'overlay-kit';
import { PostHogProvider } from 'posthog-js/react';

import { PostHogClient } from '@/bootstrap/posthog';
import { SelectedTimetableProvider } from '@/components/Providers/SelectedTimetableProvider';
import { StudentInfoProvider } from '@/components/Providers/StudentInfoProvider';
import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { ToastProvider } from '@/components/Providers/ToastProvider';

export const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <PostHogProvider client={PostHogClient}>
      <TanstackQueryProvider>
        <StudentInfoProvider>
          <SelectedTimetableProvider>
            <ToastProvider duration={3000}>
              <OverlayProvider>{children}</OverlayProvider>
            </ToastProvider>
          </SelectedTimetableProvider>
        </StudentInfoProvider>
      </TanstackQueryProvider>
    </PostHogProvider>
  );
};
