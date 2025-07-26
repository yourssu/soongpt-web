import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { useDebounce } from 'react-simplikit';

export function useDelayedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  const setter = useDebounce((v: T) => {
    startTransition(() => setDebouncedValue(v));
  }, delay);

  useEffect(() => {
    setter(value);
  }, [value, setter]);

  return useDeferredValue(debouncedValue);
}
