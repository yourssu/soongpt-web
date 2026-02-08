import { tv } from 'tailwind-variants';

import { cn } from '@/utils/dom';

interface ActivityActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'default' | 'large';
  variant?: 'primary' | 'secondary';
}

const actionButton = tv({
  base: 'w-full rounded-2xl font-semibold transition-colors disabled:cursor-not-allowed',
  variants: {
    variant: {
      primary:
        'bg-brandPrimary disabled:bg-bg-buttonDisabled disabled:text-text-buttonDisabled text-white',
      secondary:
        'bg-bg-brandLayerLight text-brandSecondary disabled:bg-bg-buttonDisabled disabled:text-text-buttonDisabled',
    },
    size: {
      default: 'py-3.5 text-base',
      large: 'h-14 text-[16px]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export const ActivityActionButton = ({
  children,
  className,
  size,
  type = 'button',
  variant,
  ...props
}: ActivityActionButtonProps) => {
  return (
    <button className={cn(actionButton({ variant, size }), className)} type={type} {...props}>
      {children}
    </button>
  );
};
