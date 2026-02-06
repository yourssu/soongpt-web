import { CourseList } from '@/components/CourseItem/CourseList';
import { useSuspenseGetChapelCourses } from '@/pages/ChapelSelectionActivity/hooks/useSuspenseGetChapelCourses';
import { CourseType } from '@/schemas/courseSchema';
import { formatCourseTimeSummary, parseCourseScheduleRoom } from '@/utils/courseTime';
import { cn } from '@/utils/dom';

interface ChapelCourseListProps {
  isExpanded: boolean;
  onSelect: (course: CourseType) => void;
  selectedCode?: number;
}

export const ChapelCourseList = ({ isExpanded, onSelect, selectedCode }: ChapelCourseListProps) => {
  const courses = useSuspenseGetChapelCourses();
  const visibleCourses = isExpanded ? courses : courses.slice(0, 2);

  return (
    <div
      className={cn(
        isExpanded ? 'scrollbar-hide max-h-[320px] overflow-y-auto pr-1' : 'overflow-hidden',
      )}
    >
      <CourseList
        courses={visibleCourses}
        emptyState={
          <div className="text-neutralSubtle flex w-full items-center justify-center py-6 text-sm">
            채플 과목이 없어요.
          </div>
        }
        isSelected={(course) => selectedCode === course.code}
        itemClassName="min-h-[96px] rounded-[20px] border-2 border-transparent bg-white p-4"
        listClassName="gap-2"
        onToggle={(course) => onSelect(course)}
        renderDescription={(course) => {
          const courseTimes = parseCourseScheduleRoom(course.scheduleRoom);
          const courseTimeSummary = formatCourseTimeSummary(courseTimes);
          return <span className="text-black">{courseTimeSummary}</span>;
        }}
        renderExtraBadge={(course) => {
          const tagLabel = course.field ?? course.subCategory ?? '채플';
          return (
            <div className="text-brandSecondary bg-bg-brandLayerLight flex h-6 items-center rounded-lg px-2 text-xs">
              {tagLabel}
            </div>
          );
        }}
        renderSubtitle={(course) => {
          const professorLabel =
            course.professor.length > 0
              ? `${course.professor.join(', ')} 교수님`
              : '담당 교수님 미정';
          const isSelected = selectedCode === course.code;
          return (
            <span className={cn('text-xs', isSelected && 'text-brandPrimary')}>
              {professorLabel}
            </span>
          );
        }}
      />
    </div>
  );
};
