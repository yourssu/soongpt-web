import clsx from 'clsx';
import { tv } from 'tailwind-variants';

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onSelectChange?: (selected: boolean) => void;
  selected?: boolean;
}

const chip = tv({
  base: 'flex cursor-pointer place-items-center rounded-full px-3 py-0.5 text-sm transition-colors',
  variants: {
    selected: {
      true: 'text-brandPrimary bg-bg-chipSelected font-semibold',
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
    <div className={clsx(chip({ selected }), className)} onClick={handleClick} {...props}>
      {children}
    </div>
  );
};
