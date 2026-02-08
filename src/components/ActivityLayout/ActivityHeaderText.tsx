import { type ReactNode } from 'react';
import { tv } from 'tailwind-variants';

import { cn } from '@/utils/dom';

interface ActivityHeaderTextProps {
  align?: 'center' | 'start';
  className?: string;
  description?: ReactNode;
  descriptionClassName?: string;
  size?: 'default';
  title: ReactNode;
  titleClassName?: string;
}

const container = tv({
  base: 'mt-6 flex w-full flex-col',
  variants: {
    align: {
      start: 'items-start text-left',
      center: 'items-center text-center',
    },
  },
  defaultVariants: {
    align: 'start',
  },
});

const titleText = tv({
  variants: {
    size: {
      default: 'text-[24px]/[normal] font-semibold whitespace-pre-wrap',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const descriptionText = tv({
  base: 'mt-2 text-sm font-light whitespace-pre-wrap',
});

export const ActivityHeaderText = ({
  align,
  className,
  description,
  descriptionClassName,
  size = 'default',
  title,
  titleClassName,
}: ActivityHeaderTextProps) => {
  return (
    <div className={cn(container({ align }), className)}>
      <h2 className={cn(titleText({ size }), titleClassName)}>{title}</h2>
      {description ? (
        <div className={cn(descriptionText(), descriptionClassName)}>{description}</div>
      ) : null}
    </div>
  );
};
