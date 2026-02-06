export const ChapelCourseListFallback = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div className="bg-bg-layerDefault h-[96px] w-full rounded-[20px]" key={index} />
      ))}
    </div>
  );
};
