import '@stackflow/plugin-basic-ui/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import './bootstrap/channelTalk';
import './bootstrap/mixpanel';
import './bootstrap/sentry';
import App from '@/App';
import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { ToastProvider } from '@/components/Providers/ToastProvider';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <StudentMachineContext.Provider>
        <ToastProvider duration={3000}>
          <App />
        </ToastProvider>
      </StudentMachineContext.Provider>
    </TanstackQueryProvider>
  </StrictMode>,
);
