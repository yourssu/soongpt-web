import { BaseIconProps } from '@/components/Icons/type';

export const IcMonoCircleMinus = ({ size, ...props }: BaseIconProps) => {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 17 16"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="8.5" cy="8" fill="currentColor" r="8" />
      <line stroke="white" strokeWidth="2" x1="4.5" x2="12.5" y1="8" y2="8" />
    </svg>
  );
};
