import clsx from 'clsx';
import { motion, Variants } from 'motion/react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';

interface CourseSelectionHeaderProps {
  description?: string;
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

export const CourseSelectionHeader = ({ title, description }: CourseSelectionHeaderProps) => {
  return (
    <ActivityLayout.Header>
      <ProgressAppBar progress={50} />
      <div className="mt-6 flex w-full flex-col items-center">
        <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
          {title}
        </h2>
        {description && (
          <div className="items mt-1 text-center font-light whitespace-pre-wrap">{description}</div>
        )}
      </div>
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
    <ActivityLayout.Body>
      <div className={clsx('flex w-full flex-[1_1_0] flex-col gap-3', className)}>{children}</div>
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
            <button
              {...secondaryButtonProps}
              className="bg-bg-brandLayerDefault text-brandSecondary flex-1 rounded-2xl py-3.5 font-semibold"
              type="button"
            >
              {secondaryButtonProps.children}
            </button>
          )}
          <button
            {...primaryButtonProps}
            className="bg-brandPrimary disabled:bg-bg-brandLayerDefault flex-1 rounded-2xl py-3.5 font-semibold text-white disabled:cursor-not-allowed"
            disabled={primaryButtonProps.disabled || selectedCredit > MAX_COURSE_POINT}
            type="button"
          >
            {primaryButtonProps.children}
          </button>
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
