import { IcMonoSearch } from '@/components/Icons/IcMonoSearch';
import { cn } from '@/utils/dom';

interface CourseSelectionListLoadingProps {
  withSearchBar?: boolean;
}

export const CourseSelectionListLoading = ({
  withSearchBar = false,
}: CourseSelectionListLoadingProps) => {
  return (
    <div className="flex flex-col">
      {withSearchBar && (
        <div className="bg-background sticky top-[183px] flex flex-col gap-3 pb-3">
          <div className="sticky top-0 flex w-full items-center rounded-xl bg-white">
            <div className="py-2 pl-3">
              <IcMonoSearch className="text-brandPrimary" size={18} />
            </div>
            <input
              className={cn('grow px-3 py-2 outline-0')}
              disabled
              placeholder="과목명을 입력해주세요."
              type="text"
              value=""
            />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-3.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            className="min-h-[80px] animate-pulse rounded-xl border-2 border-gray-100 bg-white px-5"
            key={`course-selection-loading-${index}`}
          >
            <div className="my-2">
              <div className="h-5 w-2/3 rounded bg-gray-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-gray-100" />
              <div className="mt-3 h-3 w-1/3 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
