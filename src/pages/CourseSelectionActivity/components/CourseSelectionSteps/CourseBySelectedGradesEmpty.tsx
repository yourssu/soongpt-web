export const CourseBySelectedGradesEmpty = () => {
  return (
    <div className="flex flex-1 flex-col rounded-4xl bg-white">
      <div className="flex w-full flex-1 place-items-center">
        <div className="flex w-full flex-col place-items-center gap-4">
          <span className="text-[20px] font-medium tracking-[-0.4px] text-[#acacac]">
            모든 과목을 이수했어요!
          </span>
        </div>
      </div>
    </div>
  );
};
