import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, FallbackProps, useErrorBoundary } from 'react-error-boundary';
import { ReactNode } from 'react';
import { motion } from 'motion/react';
import Wrench from '../assets/wrench.svg';

const ErrorLayout = () => {
  const { resetBoundary } = useErrorBoundary();

  return (
    <motion.div
      className="flex flex-1 flex-col items-center gap-6 overflow-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex w-full flex-col items-center overflow-auto">
        <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
          {'서버와의 연결이\n원활하지 않아요.'}
        </h2>
        <span className="items mt-1 font-light">재요청 하더라도 사용자님의 정보는 기억할게요!</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <img className="my-auto" src={Wrench} alt={'wrench'} />
      </div>
      <div className="flex w-full items-center justify-center gap-3">
        <button
          type="button"
          className="bg-primary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
          onClick={resetBoundary}
        >
          재요청 할래요
        </button>
      </div>
    </motion.div>
  );
};

const Fallback = ({ error, children }: FallbackProps & { children: ReactNode }) => {
  const errorRange = Math.floor((error.status ?? 500) / 100);

  switch (errorRange) {
    case 4:
      return children;
    default:
      return <ErrorLayout />;
  }
};

interface SoongptErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

const SoongptErrorBoundary = ({ fallback, children }: SoongptErrorBoundaryProps) => {
  const makeFallback = (fallback: ReactNode) => {
    return (props: FallbackProps) => <Fallback {...props}>{fallback}</Fallback>;
  };

  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onError={reset}
          FallbackComponent={makeFallback(fallback)}
          fallback={undefined}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default SoongptErrorBoundary;
