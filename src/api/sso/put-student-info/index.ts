import { api } from '@/api/client';
import { PutStudentInfoRequestType } from '@/api/sso/put-student-info/request';
import { PutStudentInfoResponseSchema } from '@/api/sso/put-student-info/response';

export const putStudentInfo = async (payload: PutStudentInfoRequestType) => {
  const response = await api
    .put('sync/student-info', {
      credentials: 'include',
      json: payload,
      throwHttpErrors: false,
      timeout: false,
    })
    .json();

  return PutStudentInfoResponseSchema.parse(response);
};
