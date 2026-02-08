import { motion, Variants } from 'motion/react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { cn } from '@/utils/dom';

interface CourseSelectionHeaderProps {
  description?: string;
  progress?: number;
  title: string;
}

interface CourseSelectionImageContentProps {
  image: string;
}

interface CourseSelectionFooterProps {
  primaryButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement>;
  secondaryButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  selectedCredit: number;
}

const MAX_COURSE_POINT = 25;

const fadeInVariants: Variants = {
  initial: {
    y: 20,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const CourseSelectionHeader = ({
  title,
  description,
  progress = 0,
}: CourseSelectionHeaderProps) => {
  return (
    <ActivityLayout.Header>
      <ProgressAppBar progress={progress} />
      <ActivityHeaderText description={description} title={title} />
    </ActivityLayout.Header>
  );
};

export const CourseSelectionImageBody = ({ image }: CourseSelectionImageContentProps) => {
  return (
    <ActivityLayout.Body>
      <img alt="L-Like" className="order-2 my-auto" src={image} width={170} />
    </ActivityLayout.Body>
  );
};

export const CourseSelectionBody = ({
  children,
  className,
}: React.PropsWithChildren<{ className?: string }>) => {
  return (
    <ActivityLayout.Body className="py-2">
      <div className={cn('flex w-full flex-[1_1_0] flex-col gap-3', className)}>{children}</div>
    </ActivityLayout.Body>
  );
};

export const CourseSelectionFooter = ({
  selectedCredit,
  primaryButtonProps,
  secondaryButtonProps,
}: CourseSelectionFooterProps) => {
  return (
    <ActivityLayout.Footer>
      <div className="flex w-full flex-col items-center gap-3">
        <span className="text-base font-light">
          현재 <span className="text-brandPrimary">{selectedCredit}학점</span> 선택했어요
        </span>
        <div className="flex w-full items-center gap-1">
          {secondaryButtonProps && (
            <ActivityActionButton
              {...secondaryButtonProps}
              className={cn('flex-1', secondaryButtonProps.className)}
              type="button"
              variant="secondary"
            >
              {secondaryButtonProps.children}
            </ActivityActionButton>
          )}
          <ActivityActionButton
            {...primaryButtonProps}
            className={cn('flex-1', primaryButtonProps.className)}
            disabled={primaryButtonProps.disabled || selectedCredit > MAX_COURSE_POINT}
            type="button"
            variant="primary"
          >
            {primaryButtonProps.children}
          </ActivityActionButton>
        </div>
      </div>
    </ActivityLayout.Footer>
  );
};

/**
 * 주의) 상위에 `ActivityLayout` 컴포넌트가 있어야 해요.
 */
export const CourseSelectionLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <motion.div animate="animate" initial="initial" variants={fadeInVariants}>
      <ActivityLayout.ScrollArea>{children}</ActivityLayout.ScrollArea>
    </motion.div>
  );
};

CourseSelectionLayout.Header = CourseSelectionHeader;
CourseSelectionLayout.ImageBody = CourseSelectionImageBody;
CourseSelectionLayout.Body = CourseSelectionBody;
CourseSelectionLayout.Footer = CourseSelectionFooter;
