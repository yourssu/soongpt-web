/**
 * MSW 활성화 (개발 환경 전용)
 */
export async function enableMocking() {
  if (import.meta.env.VITE_API_MOCKING !== 'true') {
    return;
  }

  const { worker } = await import('@/mocks/browser');

  return worker.start({
    onUnhandledRequest: 'bypass', // 모킹되지 않은 요청은 그대로 통과
  });
}
