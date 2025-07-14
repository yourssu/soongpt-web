interface ProgressBarProps {
  width: number; // 0 to 100
}

const ProgressBar = ({ width }: ProgressBarProps) => {
  return (
    <div className="h-1 w-full bg-black">
      <div
        className="bg-brandPrimary h-full transition-all duration-500"
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;
