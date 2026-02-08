import { IcMonoCircleMinus } from '@/components/Icons/IcMonoCircleMinus';
import { CourseType } from '@/types/course';

interface RemovableCourseListItemProps {
  course: CourseType;
  onClickRemove: () => void;
}

export const RemovableCourseListItem = ({
  course,
  onClickRemove,
}: RemovableCourseListItemProps) => {
  return (
    <div className="flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl bg-white px-5">
      <div className="my-2">
        <div className="text-lg font-semibold">{course.name}</div>
        <div className="text-xs">{course.professor.join(', ')} 교수님</div>
      </div>
      <div className="flex items-center gap-2">
        {course.point > 0 && (
          <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-2 text-[12px]/[18px] font-semibold text-nowrap">
            {course.point}학점
          </div>
        )}
        <button className="cursor-pointer rounded-full" onClick={onClickRemove}>
          <IcMonoCircleMinus className="text-[#EAEAEA]" size={20} />
        </button>
      </div>
    </div>
  );
};
