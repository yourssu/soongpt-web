import { useContext } from 'react';

import { ToastContext } from '@/components/Providers/ToastProvider/context';

export const useToastContext = () => {
  const toastContext = useContext(ToastContext);

  if (!toastContext) {
    throw new Error('useToastContext는 ToastProvider 하위에서만 사용할 수 있어요.');
  }

  return toastContext;
};
