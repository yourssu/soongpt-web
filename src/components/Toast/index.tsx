import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { tv } from 'tailwind-variants';

import { ToastType } from '@/components/Providers/ToastProvider/context';

const lottie = tv({
  base: 'flex items-center justify-center',
  variants: {
    type: {
      error: 'size-9 p-1',
      success: 'size-9',
      default: 'h-9 w-2.5',
    },
  },
});

export const Toast = ({ children, type }: React.PropsWithChildren<{ type: ToastType }>) => {
  const src = (() => {
    switch (type) {
      case 'error':
        return '/lotties/error.lottie';
      case 'success':
        return '/lotties/success.lottie';
      default:
        return undefined;
    }
  })();

  return (
    <div className="flex items-center rounded-xl bg-gray-800 py-2 pr-5.5 pl-3 font-semibold text-white">
      <div className={lottie({ type })}>
        {!!src && <DotLottieReact autoplay loop={false} speed={1.5} src={src} />}
      </div>
      {children}
    </div>
  );
};
