import { Info } from 'lucide-react';
import { ElementType, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface HintIconProps extends HTMLAttributes<SVGSVGElement> {
  as?: ElementType;
}

const HintText = ({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={`text-xs ${twMerge(className)}`} {...props}>
      {children}
    </span>
  );
};

const HintIcon = ({ as: Icon = Info, className, ...props }: HintIconProps) => {
  return <Icon className={`size-3 ${twMerge(className)}`} {...props} />;
};

export const Hint = ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`text-neutralHint flex items-center gap-2 ${twMerge(className)}`} {...props}>
      {children}
    </div>
  );
};

Hint.Text = HintText;
Hint.Icon = HintIcon;
