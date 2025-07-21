import '@stackflow/plugin-basic-ui/index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';

import './index.css';
import './bootstrap/channelTalk';
import './bootstrap/mixpanel';
import './bootstrap/sentry';
import { TanstackQueryProvider } from '@/components/Providers/TanstackQueryProvider';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackQueryProvider>
      <StudentMachineContext.Provider>
        <App />
      </StudentMachineContext.Provider>
    </TanstackQueryProvider>
  </StrictMode>,
);
