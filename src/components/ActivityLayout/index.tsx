import { AppScreen } from '@stackflow/plugin-basic-ui';
import clsx from 'clsx';

import { Devtools } from '@/components/Devtools';

const Header = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className="sticky top-0 z-[100] w-full bg-white px-[37.5px] pt-6 pb-4">{children}</div>
  );
};

const Body = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div
      className={clsx('flex w-full flex-[1_1_0] flex-col items-center px-[37.5px] py-6', className)}
    >
      {children}
    </div>
  );
};

const Footer = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className="sticky bottom-0 z-[100] w-full bg-white px-[37.5px] pt-4 pb-6">{children}</div>
  );
};

/* 
  - 레이아웃 높이에 1px 더하는 이유: https://channel.io/ko/blog/articles/cross-browsing-ios15-12bccbc3 
  - Devtools는 반드시 AppScreen 외부에 있어야해요.
*/
const ScrollArea = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <div className="h-dvh w-full overflow-y-hidden" data-activity-scroll-area>
      <div
        className={clsx(
          'flex h-[calc(100dvh+1px)] w-full flex-col items-center overflow-y-scroll overscroll-none',
          className,
        )}
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
