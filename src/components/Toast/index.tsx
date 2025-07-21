import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { tv } from 'tailwind-variants';

import { ToastType } from '@/components/Providers/ToastProvider/context';

const lottie = tv({
  base: 'flex shrink-0 items-center justify-center',
  variants: {
    type: {
      error: 'size-8.5 p-1',
      success: 'size-8.5',
      default: 'h-8.5 w-2.5',
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
    <div className="flex w-fit items-center rounded-xl bg-gray-800 py-2 pr-5.5 pl-3 text-[15px] font-medium text-white">
      <div className={lottie({ type })}>
        {!!src && <DotLottieReact autoplay loop={false} speed={1.5} src={src} />}
      </div>
      {children}
    </div>
  );
};
