import { AppScreen } from '@stackflow/plugin-basic-ui';
import clsx from 'clsx';

interface ActivityLayoutProps {
  className?: string;
}

export const ActivityLayout = ({
  children,
  className,
}: React.PropsWithChildren<ActivityLayoutProps>) => {
  return (
    <AppScreen>
      <div
        className={clsx('flex min-h-dvh w-full flex-col items-center px-[37.5px] py-6', className)}
      >
        {children}
      </div>
    </AppScreen>
  );
};
