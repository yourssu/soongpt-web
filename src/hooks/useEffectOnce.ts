import { useEffect, useRef } from 'react';

export const useEffectOnce = (callback: (...args: any) => void) => {
  const once = useRef(false);
  useEffect(() => {
    if (once.current === false) {
      callback();
      once.current = true;
    }
  }, [callback, once]);
};
