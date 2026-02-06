export const SectionTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-2 text-[20px] font-semibold">
      <span className="bg-brandPrimary size-4 rounded-full" />
      <span>{title}</span>
    </div>
  );
};
