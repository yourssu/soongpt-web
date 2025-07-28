import { motion, Variants } from 'motion/react';

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
    <div className="order-1">
      <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
        {title}
      </h2>
      {description && (
        <div className="items mt-1 text-center font-light whitespace-pre-wrap">{description}</div>
      )}
    </div>
  );
};

export const CourseSelectionImageBody = ({ image }: CourseSelectionImageContentProps) => {
  return <img alt="L-Like" className="order-2 my-auto" src={image} width={170} />;
};

export const CourseSelectionBody = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <div className="order-2 mt-6 flex w-full flex-[1_1_0] flex-col gap-3 overflow-auto">
      {children}
    </div>
  );
};

export const CourseSelectionFooter = ({
  selectedCredit,
  primaryButtonProps,
  secondaryButtonProps,
}: CourseSelectionFooterProps) => {
  return (
    <div className="order-3 flex w-full flex-col items-center gap-3">
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
          className="bg-brandPrimary flex-1 rounded-2xl py-3.5 font-semibold text-white"
          type="button"
        >
          {primaryButtonProps.children}
        </button>
      </div>
    </div>
  );
};

export const CourseSelectionLayout = ({ children }: React.PropsWithChildren<unknown>) => {
  return (
    <motion.div
      animate="animate"
      className="flex flex-1 flex-col items-center gap-6 overflow-auto"
      initial="initial"
      variants={fadeInVariants}
    >
      <div className="flex w-full flex-1 flex-col items-center overflow-auto">{children}</div>
    </motion.div>
  );
};

CourseSelectionLayout.Header = CourseSelectionHeader;
CourseSelectionLayout.ImageBody = CourseSelectionImageBody;
CourseSelectionLayout.Body = CourseSelectionBody;
CourseSelectionLayout.Footer = CourseSelectionFooter;
