import { SLOT_HEIGHT } from '@/components/Timetable/type';
import { parseCourseTime } from '@/components/Timetable/utils/parseCourseTime';
import { CourseTimeType } from '@/types/course';

const MINUTES_PER_SLOT = 5;

const timetableCourseColors = [
  '#D497EE',
  '#9E86E1',
  '#7AA5E9',
  '#7CD1C1',
  '#77CA88',
  '#A7C970',
  '#ECC369',
  '#fcaa67',
  '#f08676',
] as const;

const getTimetableCourseColor = (courseName: string) => {
  return timetableCourseColors[courseName.length % timetableCourseColors.length];
};

const getCoursePosition = (courseTime: CourseTimeType): { height: number; top: number } => {
  const { hour: startHour, minute: startMinute } = parseCourseTime(courseTime.start);
  const { hour: endHour, minute: endMinute } = parseCourseTime(courseTime.end);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  const top = (startMinute / MINUTES_PER_SLOT) * SLOT_HEIGHT;
  const height = ((end - start) / MINUTES_PER_SLOT) * SLOT_HEIGHT;

  return { top, height };
};

const getLineClamp = (courseTime: CourseTimeType): number => {
  const { hour: startHour, minute: startMinute } = parseCourseTime(courseTime.start);
  const { hour: endHour, minute: endMinute } = parseCourseTime(courseTime.end);

  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  // 50분 이하 2줄 제한
  if (end - start <= 50) {
    return 2;
  }
  // 1시간 15분 이하 3줄 제한
  else if (end - start <= 75) {
    return 3;
  } else {
    return 4;
  }
};

export const getTimetableCourseStyle = ({
  courseTime,
  courseName,
}: {
  courseName: string;
  courseTime: CourseTimeType;
}): React.CSSProperties => {
  const { top, height } = getCoursePosition(courseTime);
  const bgColor = getTimetableCourseColor(courseName);
  const lineClamp = getLineClamp(courseTime);

  return {
    backgroundColor: bgColor,
    borderColor: bgColor,
    top: `${top}px`,
    height: `${height}px`,
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: lineClamp,
    overflow: 'hidden',
  };
};
