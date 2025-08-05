import { Lottie } from '@toss/lottie';
import { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

import { ToastLottieAssetMap, ToastType } from '@/components/Providers/ToastProvider/type';

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

type LottieProps = Omit<ComponentProps<typeof Lottie>, 'json' | 'src'>;
const lottieProps: Record<ToastType, LottieProps> = {
  success: {
    speed: 1.5,
  },
  error: {
    speed: 1,
  },
  default: {},
};

export const Toast = ({ children, type }: React.PropsWithChildren<{ type: ToastType }>) => {
  const src = ToastLottieAssetMap[type];
  const options = lottieProps[type];

  return (
    <div className="flex w-fit items-center rounded-xl bg-gray-800 py-2 pr-5.5 pl-3 text-[15px] font-medium text-white">
      <div className={lottie({ type })}>
        {!!src && <Lottie {...options} autoPlay loop={false} src={src} />}
      </div>
      {children}
    </div>
  );
};
