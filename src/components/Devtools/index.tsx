import { lazy, Suspense } from 'react';

import { STAGE } from '@/config';

const Comp =
  STAGE === 'alpha'
    ? lazy(() =>
        import('@/components/Devtools/DevtoolsPrimitive').then(({ DevtoolsPrimitive }) => ({
          default: DevtoolsPrimitive,
        })),
      )
    : () => null;

export const Devtools = () => {
  return (
    <Suspense>
      <Comp />
    </Suspense>
  );
};
