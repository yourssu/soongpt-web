import '@stackflow/plugin-basic-ui/index.css';

import './index.css';
import './bootstrap/channelTalk';
import './bootstrap/mixpanel';
import './bootstrap/sentry';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from '@/App';
import { Devtools } from '@/components/Devtools';
import { Providers } from '@/components/Providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
      <Devtools />
    </Providers>
  </StrictMode>,
);
