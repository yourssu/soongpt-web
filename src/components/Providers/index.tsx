import { OverlayProvider } from 'overlay-kit';

import { StudentInfoProvider } from '@/components/Providers/StudentInfoProvider';
import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { ToastProvider } from '@/components/Providers/ToastProvider';

export const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <OverlayProvider>
      <TanstackQueryProvider>
        <StudentInfoProvider>
          <ToastProvider duration={3000}>{children}</ToastProvider>
        </StudentInfoProvider>
      </TanstackQueryProvider>
    </OverlayProvider>
  );
};
