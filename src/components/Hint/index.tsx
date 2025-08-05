import { Info } from 'lucide-react';
import { ElementType, HTMLAttributes } from 'react';

import { cn } from '@/utils/dom';

interface HintIconProps extends HTMLAttributes<SVGSVGElement> {
  as?: ElementType;
}

const HintText = ({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('text-xs', className)} {...props}>
      {children}
    </span>
  );
};

const HintIcon = ({ as: Icon = Info, className, ...props }: HintIconProps) => {
  return <Icon className={cn('size-3', className)} {...props} />;
};

export const Hint = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn('text-neutralHint flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
};

Hint.Text = HintText;
Hint.Icon = HintIcon;
