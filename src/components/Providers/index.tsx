import { OverlayProvider } from 'overlay-kit';

import { StudentInfoProvider } from '@/components/Providers/StudentInfoProvider';
import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { ToastProvider } from '@/components/Providers/ToastProvider';

export const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <TanstackQueryProvider>
      <StudentInfoProvider>
        <ToastProvider duration={3000}>
          <OverlayProvider>{children}</OverlayProvider>
        </ToastProvider>
      </StudentInfoProvider>
    </TanstackQueryProvider>
  );
};
