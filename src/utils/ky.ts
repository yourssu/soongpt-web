import { HTTPError } from 'ky';

export const isKyHTTPError = (e: any): e is HTTPError => e instanceof HTTPError;

export const getKyHTTPErrorMessage = async (e: HTTPError) => {
  const type = e.response.headers.get('content-type') || '';

  if (!e.response.body) {
    return e.message;
  }

  if (type.includes('json')) {
    // Todo: 규격화된 에러 메시지 처리가 가능할지?
    return (await e.response.json<{ timestamp: string }>()).timestamp;
  }

  if (type.includes('text')) {
    return await e.response.text();
  }

  return undefined;
};

export const getKyHTTPErrorRange = (e: HTTPError) => {
  const headStatusCode = Math.floor(e.response.status / 100).toString() as
    | '1'
    | '2'
    | '3'
    | '4'
    | '5';
  return `${headStatusCode}00` as const;
};
