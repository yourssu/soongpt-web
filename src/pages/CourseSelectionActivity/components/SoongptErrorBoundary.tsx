import * as Sentry from '@sentry/react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ReactElement, ReactNode } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { handleError } from '@/utils/error';
import { getKyHTTPErrorRange } from '@/utils/ky';

interface SoongptErrorBoundaryProps {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  FallbackComponent: ReactElement;
  progress?: number;
}

const SoongptErrorBoundary = ({
  FallbackComponent,
  progress = 0,
  children,
}: SoongptErrorBoundaryProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <Sentry.ErrorBoundary
          fallback={({ error, resetError }) => {
            const { error: handledError, type } = handleError(error);
            const errorRange = type === 'KyHTTPError' ? getKyHTTPErrorRange(handledError) : '500';

            switch (errorRange) {
              case '400':
                return FallbackComponent;
              default:
                return (
                  <motion.div
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-1 flex-col items-center gap-6 overflow-y-auto"
                    initial={{ y: 20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <ActivityLayout.ScrollArea>
                      <ActivityLayout.Header>
                        <ProgressAppBar progress={progress} />
                        <ActivityHeaderText
                          align="center"
                          description="재요청 하더라도 사용자님의 정보는 기억할게요!"
                          descriptionClassName="mt-1 font-light"
                          title={'서버와의 연결이\n원활하지 않아요.'}
                        />
                      </ActivityLayout.Header>
                      <ActivityLayout.Body>
                        <img
                          alt={'wrench'}
                          className="my-auto"
                          src="/images/wrench.webp"
                          width={170}
                        />
                      </ActivityLayout.Body>
                      <ActivityLayout.Footer>
                        <ActivityActionButton className="flex-1" onClick={resetError} type="button">
                          재요청 할래요
                        </ActivityActionButton>
                      </ActivityLayout.Footer>
                    </ActivityLayout.ScrollArea>
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
