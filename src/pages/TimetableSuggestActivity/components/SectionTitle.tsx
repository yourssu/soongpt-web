type SectionTitleProps = {
  dotClassName?: string;
  title: string;
};

export const SectionTitle = ({ title, dotClassName = 'bg-brandPrimary' }: SectionTitleProps) => {
  return (
    <div className="flex items-center gap-2 text-[20px] font-semibold">
      <span className={`size-4 rounded-full ${dotClassName}`} />
      <span>{title}</span>
    </div>
  );
};
