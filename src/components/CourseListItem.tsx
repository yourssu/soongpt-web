import { Course } from '../type/course.type.ts';

interface CourseListItemProps {
  course: Course;
  onClickCourseItem: (courseId: string) => void;
  isSelected: boolean;
}

const CourseListItem = ({ onClickCourseItem, course, isSelected }: CourseListItemProps) => {
  const handleClick = () => {
    onClickCourseItem(course.courseId);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex min-h-[72px] w-full items-center justify-between rounded-xl border-2 ${isSelected ? 'border-[#6B5CFF] text-[#6B5CFF]' : 'border-transparent'} bg-[#F7F8F8] px-5`}
    >
      <div>
        <div className="text-[20px] font-semibold">{course.name}</div>
        <div className="text-[12px] font-light">{course.professors.join(', ')} 교수님</div>
      </div>
      <div className="flex h-6 items-center rounded-lg bg-[#ECEFFF] px-1.5 text-[12px]/[18px] font-semibold text-[#5736F5]">
        {course.credit}학점
      </div>
    </div>
  );
};

export default CourseListItem;
