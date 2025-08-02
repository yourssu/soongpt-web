import { api } from '@/api/client';

/**
 * @param contact `이메일 주소` 또는 `휴대폰 번호` 중 아무 것이나 입력
 */
export const postContact = async (contact: string) => {
  await api.post('contacts', {
    json: {
      content: contact,
    },
  });
};
