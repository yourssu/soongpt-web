import { IcMonoCircleMinus } from '@/components/Icons/IcMonoCircleMinus';
import { CourseType } from '@/schemas/courseSchema';

interface RemovableCourseListItemProps {
  course: CourseType;
  onClickRemove: () => void;
}

export const RemovableCourseListItem = ({
  course,
  onClickRemove,
}: RemovableCourseListItemProps) => {
  return (
    <div className="bg-bg-layerDefault flex min-h-[72px] w-full items-center justify-between gap-3 rounded-xl px-5">
      <div className="my-2">
        <div className="font-semibold">{course.name}</div>
        <div className="text-xs font-light">{course.professor.join(', ')} 교수님</div>
      </div>
      <div className="flex items-center gap-2">
        {course.point > 0 && (
          <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-1.5 text-[12px]/[18px] font-semibold text-nowrap">
            {course.point}학점
          </div>
        )}
        <button className="cursor-pointer rounded-full" onClick={onClickRemove}>
          <IcMonoCircleMinus className="text-neutralDisabled" size={16} />
        </button>
      </div>
    </div>
  );
};
