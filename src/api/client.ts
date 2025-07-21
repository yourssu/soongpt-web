import ky from 'ky';

import { config } from '@/config';

const api = ky.create({
  prefixUrl: config.apiUrl,
});

export default api;
