import { createContext } from 'react';

import { ToastItem, ToastType } from '@/components/Providers/ToastProvider/type';

interface ToastContextProps {
  addToast: (props: { text: string; type: ToastType }) => void;
  toasts: ToastItem[];
}

export const ToastContext = createContext<ToastContextProps | undefined>(undefined);
