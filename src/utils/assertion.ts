export function assert(
  condition: unknown,
  error: Error | string = new Error('올바르지 않은 접근이에요.'),
): asserts condition {
  if (!condition) {
    if (typeof error === 'string') {
      throw new Error(error);
    } else {
      throw error;
    }
  }
}

export function assertNonNullish<T>(
  value: null | T | undefined,
  error: Error | string = new Error('값이 비어 있어요.'),
): asserts value is NonNullable<T> {
  assert(value !== null && value !== undefined, error);
}

/* 
  타입상으로만 검증하고 싶을 때 사용해요.
*/
export function assertSoftly(condition: unknown): asserts condition {
  condition; // eslint-disable-line @typescript-eslint/no-unused-expressions
}

/* 
  타입상으로만 검증하고 싶을 때 사용해요.
*/
export function assertNonNullishSoftly<T>(
  value: null | T | undefined,
): asserts value is NonNullable<T> {
  assertSoftly(value !== null && value !== undefined);
}
