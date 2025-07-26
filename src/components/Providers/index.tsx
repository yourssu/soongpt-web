import { OverlayProvider } from 'overlay-kit';

import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { ToastProvider } from '@/components/Providers/ToastProvider';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';

export const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <OverlayProvider>
      <TanstackQueryProvider>
        <StudentMachineContext.Provider>
          <ToastProvider duration={3000}>{children}</ToastProvider>
        </StudentMachineContext.Provider>
      </TanstackQueryProvider>
    </OverlayProvider>
  );
};
