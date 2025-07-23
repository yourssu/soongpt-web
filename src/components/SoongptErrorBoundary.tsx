import * as Sentry from '@sentry/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ReactElement, ReactNode } from 'react';

import { SoongptError } from '@/schemas/errorSchema';

interface SoongptErrorBoundaryProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FallbackComponent: ReactElement;
}

const SoongptErrorBoundary = ({ FallbackComponent, children }: SoongptErrorBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => {
            const errorRange = Math.floor(((error as SoongptError).status ?? 500) / 100);

            switch (errorRange) {
              case 4:
                return FallbackComponent;
              default:
                return (
                  <motion.div
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-1 flex-col items-center gap-6 overflow-auto"
                    initial={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="flex w-full flex-col items-center overflow-auto">
                      <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
                        {'서버와의 연결이\n원활하지 않아요.'}
                      </h2>
                      <span className="items mt-1 font-light">
                        재요청 하더라도 사용자님의 정보는 기억할게요!
                      </span>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                      <img
                        alt={'wrench'}
                        className="my-auto"
                        src="/images/wrench.webp"
                        width={170}
                      />
                    </div>
                    <div className="flex w-full items-center justify-center gap-3">
                      <button
                        className="bg-brandPrimary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
                        onClick={resetError}
                        type="button"
                      >
                        재요청 할래요
                      </button>
                    </div>
                  </motion.div>
                );
            }
          }}
          onError={reset}
        >
          {children}
        </Sentry.ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SoongptErrorBoundary;
