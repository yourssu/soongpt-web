import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

/**
 * MSW 브라우저 워커 설정
 *
 * 개발 환경에서 Service Worker를 통해 API 요청을 가로채고 모킹합니다.
 */
export const worker = setupWorker(...handlers);
