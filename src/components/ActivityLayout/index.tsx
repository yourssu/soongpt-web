import { AppScreen } from '@stackflow/plugin-basic-ui';
import { tv, type VariantProps } from 'tailwind-variants';

import { Devtools } from '@/components/Devtools';
import { cn } from '@/utils/dom';

const body = tv({
  base: 'bg-background flex w-full flex-[1_1_0] flex-col items-center px-[37.5px]',
  variants: {
    variant: {
      default: 'py-6',
      centered: 'justify-center gap-4 py-6',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Header = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div
      className={cn('bg-background sticky top-0 z-[100] w-full px-[37.5px] pt-6 pb-4', className)}
    >
      {children}
    </div>
  );
};

const Body = ({
  children,
  className,
  variant,
}: React.PropsWithChildren<{
  className?: string;
  variant?: VariantProps<typeof body>['variant'];
}>) => {
  return <div className={cn(body({ variant }), className)}>{children}</div>;
};

const Footer = ({
  children,
  className,
}: React.PropsWithChildren<{
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        'bg-background sticky bottom-0 z-[100] w-full px-[37.5px] pt-4 pb-6',
        className,
      )}
    >
      {children}
    </div>
  );
};

/* 
  - 레이아웃 높이에 1px 더하는 이유: https://channel.io/ko/blog/articles/cross-browsing-ios15-12bccbc3 
  - Devtools는 반드시 AppScreen 외부에 있어야해요.
*/
const ScrollArea = ({
  children,
  className,
  onScroll,
}: React.PropsWithChildren<{
  className?: string;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}>) => {
  return (
    <div className="h-dvh w-full overflow-y-hidden" data-activity-scroll-area>
      <div
        className={cn(
          'bg-background flex h-[calc(100dvh+1px)] w-full flex-col items-center overflow-y-auto overscroll-none',
          className,
        )}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  );
};

export const ActivityLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div>
      <AppScreen preventSwipeBack>{children}</AppScreen>
      <Devtools />
    </div>
  );
};

ActivityLayout.Header = Header;
ActivityLayout.Footer = Footer;
ActivityLayout.Body = Body;
ActivityLayout.ScrollArea = ScrollArea;
