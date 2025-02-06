import { Info } from 'lucide-react';
import { ElementType, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface HintProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

interface HintTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

interface HintIconProps extends HTMLAttributes<SVGSVGElement> {
  as?: ElementType;
}

const Hint = ({ children, className, ...props }: HintProps) => {
  return (
    <div className={`text-hint flex items-center gap-2 ${twMerge(className)}`} {...props}>
      {children}
    </div>
  );
};

const HintText = ({ children, className, ...props }: HintTextProps) => {
  return (
    <span className={`text-xs ${twMerge(className)}`} {...props}>
      {children}
    </span>
  );
};

const HintIcon = ({ as: Icon = Info, className, ...props }: HintIconProps) => {
  return <Icon className={`size-3 ${twMerge(className)}`} {...props} />;
};

Hint.Text = HintText;
Hint.Icon = HintIcon;

export default Hint;
