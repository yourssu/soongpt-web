import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ReactElement, ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { SoongptError } from '../schemas/errorSchema.ts';
import { motion } from 'motion/react';
import Wrench from '../assets/wrench.svg';

interface SoongptErrorBoundaryProps {
  children: ReactNode;
  clientErrorComponent?: ReactElement;
}

const SoongptErrorBoundary = ({ clientErrorComponent, children }: SoongptErrorBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Sentry.ErrorBoundary
          onError={reset}
          fallback={({ error, resetError }) => {
            const errorRange = Math.floor(((error as SoongptError).status ?? 500) / 100);
            const serverErrorComponent = (
              <motion.div
                className="mt-6 flex flex-1 flex-col items-center gap-6 overflow-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
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
                  <img className="my-auto" src={Wrench} alt={'wrench'} />
                </div>
                <div className="flex w-full items-center justify-center gap-3">
                  <button
                    onClick={resetError}
                    type="button"
                    className="bg-primary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
                  >
                    재요청 할래요
                  </button>
                </div>
              </motion.div>
            );

            if (clientErrorComponent === undefined) return serverErrorComponent;

            switch (errorRange) {
              case 4:
                return clientErrorComponent;
              default:
                return serverErrorComponent;
            }
          }}
        >
          {children}
        </Sentry.ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SoongptErrorBoundary;
