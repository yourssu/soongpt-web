import { type ReactNode } from 'react';
import { tv } from 'tailwind-variants';

import { cn } from '@/utils/dom';

interface DotSectionTitleProps {
  className?: string;
  dotClassName?: string;
  size?: 'default';
  title: ReactNode;
}

const root = tv({
  base: 'flex items-center gap-2 font-semibold',
  variants: {
    size: {
      default: 'text-[20px]/[24px]',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const dot = tv({
  base: 'inline-block size-4 rounded-full',
});

export const DotSectionTitle = ({
  className,
  dotClassName,
  size = 'default',
  title,
}: DotSectionTitleProps) => {
  return (
    <div className={cn(root({ size }), className)}>
      <span className={cn(dot(), dotClassName ?? 'bg-brandPrimary')} />
      <span>{title}</span>
    </div>
  );
};
