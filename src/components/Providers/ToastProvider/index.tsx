import { useEffect, useRef, useState } from 'react';

import { ToastContext } from '@/components/Providers/ToastProvider/context';
import {
  ToastItem,
  ToastLottieAssetMap,
  ToastType,
} from '@/components/Providers/ToastProvider/type';
import { ToastAnimationGroup } from '@/components/Toast/ToastAnimationGroup';
import { useEffectOnce } from '@/hooks/useEffectOnce';

interface ToastProviderProps {
  duration: number;
}

export const ToastProvider = ({
  duration,
  children,
}: React.PropsWithChildren<ToastProviderProps>) => {
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  /* 
    Cache lottie assets
    - 첫 토스트 렌더링 시점에 로띠를 불러오면 경험이 좋지 않기 때문에 미리 캐시해둬요.
  */
  useEffectOnce(() => {
    Object.values(ToastLottieAssetMap).forEach((src) => {
      if (!src) {
        return;
      }
      fetch(src, { cache: 'force-cache' });
    });
  });

  useEffect(() => {
    const current = timeouts.current;
    return () => {
      current.forEach((timeout) => clearTimeout(timeout));
    };
  }, []);

  const addToast = ({ text, type }: { text: string; type: ToastType }) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text, type }]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);

    timeouts.current.push(timeout);
  };

  return (
    <ToastContext.Provider value={{ addToast, toasts }}>
      {children}
      <ToastAnimationGroup />
    </ToastContext.Provider>
  );
};
