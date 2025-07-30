import { AppScreen } from '@stackflow/plugin-basic-ui';
import clsx from 'clsx';

import { Devtools } from '@/components/Devtools';

interface ActivityLayoutProps {
  className?: string;
}

export const ActivityLayout = ({
  children,
  className,
}: React.PropsWithChildren<ActivityLayoutProps>) => {
  return (
    <div>
      <AppScreen>
        <div
          className={clsx(
            'flex min-h-dvh w-full flex-col items-center px-[37.5px] py-6',
            className,
          )}
        >
          {children}
        </div>
      </AppScreen>
      {/* Devtools는 반드시 AppScreen 외부에 있어야해요. */}
      <Devtools />
    </div>
  );
};
