import { api } from '@/api/client';
import { syncStatusSchema } from '@/api/sso/get-sync-status/response';

export const getSyncStatus = async () => {
  const response = await api
    .get('sync/status', {
      credentials: 'include',
      throwHttpErrors: false,
      timeout: false,
    })
    .json();

  return syncStatusSchema.parse(response);
};
