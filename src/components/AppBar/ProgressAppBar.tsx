import { BaseAppBar } from '@/components/AppBar/BaseAppBar';

interface ProgressAppBarProps {
  progress: number;
}

export const ProgressAppBar = ({ progress }: ProgressAppBarProps) => {
  return (
    <BaseAppBar>
      <div className="h-1 w-full rounded-full bg-black">
        <div
          className="bg-brandPrimary h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </BaseAppBar>
  );
};
