import ky from 'ky';

import { config } from '@/config';

export const api = ky.create({
  prefixUrl: config.apiUrl,
});
