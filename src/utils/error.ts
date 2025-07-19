import { HTTPError } from 'ky';
import { ZodError } from 'zod';

import { SoongptError, soongptErrorSchema } from '@/schemas/errorSchema';

export async function transformError(e: unknown): Promise<SoongptError> {
  if (!(e instanceof HTTPError)) {
    return {
      message: '알 수 없는 에러가 발생했습니다.',
      status: 500,
      timestamp: new Date(),
    };
  }
  return e.response
    .json()
    .then((res) => soongptErrorSchema.parse(res))
    .catch((err) => {
      if (err instanceof ZodError) {
        return {
          message: 'ZodError',
          status: 500,
          timestamp: new Date(),
        };
      }
      if (err instanceof HTTPError) {
        return {
          message: 'Failed to parse JSON',
          status: 500,
          timestamp: new Date(),
        };
      }
      return {
        message: '알 수 없는 에러가 발생했습니다.',
        status: 500,
        timestamp: new Date(),
      };
    });
}
