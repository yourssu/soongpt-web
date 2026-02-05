import { tv } from 'tailwind-variants';

import { cn } from '@/utils/dom';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onSelectChange?: (selected: boolean) => void;
  selected?: boolean;
}

const chip = tv({
  base: 'text-md flex shrink-0 cursor-pointer place-items-center rounded-full px-4 py-2 transition-colors',
  variants: {
    selected: {
      true: 'text-brandPrimary bg-bg-chipSelected font-medium',
      false: 'text-neutralMuted bg-bg-chipUnselected font-normal',
    },
  },
});

export const SelectableChip = ({
  selected = false,
  children,
  className,
  onSelectChange,
  onClick,
  ...props
}: ChipProps) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    onSelectChange?.(!selected);
    onClick?.(e);
  };

  return (
    <div className={cn(chip({ selected }), className)} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};
