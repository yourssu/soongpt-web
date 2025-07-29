import { BaseIconProps } from '@/components/Icons/type';

export const IcMonoClose = ({ size, ...props }: BaseIconProps) => {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 14 14"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.74625 13.6532L0.692505 12.5995L6.2925 6.99945L0.692505 1.39945L1.74625 0.345703L7.34625 5.9457L12.9463 0.345703L14 1.39945L8.40001 6.99945L14 12.5995L12.9463 13.6532L7.34625 8.0532L1.74625 13.6532Z"
        fill="currentColor"
      />
    </svg>
  );
};
