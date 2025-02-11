import { courseSelectionInfo, gradeSelection } from '../../data/courseSelectionInfo.ts';
import GradeChip from '../GradeChip.tsx';
import { motion } from 'motion/react';
import ViewSelectedCoursesButton from '../ViewSelectedCoursesButton.tsx';
import CourseListItem from '../CourseListItem.tsx';
import { ArrayState } from '../../type/common.type.ts';
import { Grade } from '../../schemas/studentSchema.ts';
import { Course } from '../../schemas/courseSchema.ts';
import { isSameCourse } from '../../utils/course.ts';
import { useContext } from 'react';
import { CourseTypeContext } from '../../context/CourseTypeContext.ts';

interface CourseSelectionSkeletonProps {
  courses: Course[];
  coursesState: ArrayState;
  selectedCourses: Course[];
  selectedGrades: Grade[];
  totalCredit?: {
    MAJOR_REQUIRED: number;
    MAJOR_ELECTIVE: number;
    GENERAL_REQUIRED: number;
  };
  onClickGradeChip?: (grades: Grade[]) => () => void;
  onClickCourseItem?: (course: Course) => void;
  onNextClick?: () => void;
  title: string;
  description?: string;
  image?: string;
}

const CourseSelectionSkeleton = ({
  coursesState,
  selectedCourses,
  selectedGrades,
  courses,
  onClickGradeChip,
  onClickCourseItem,
  totalCredit,
  onNextClick,
  title,
  description,
  image,
}: CourseSelectionSkeletonProps) => {
  const type = useContext(CourseTypeContext);

  return (
    <motion.div
      key={type}
      className="flex flex-1 flex-col items-center gap-6 overflow-auto"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex w-full flex-1 flex-col items-center overflow-auto">
        <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
          {title}
        </h2>
        <span className="items mt-1 font-light">{description}</span>
        {image ? (
          <img className="my-auto" src={image} alt="L-Like" />
        ) : (
          <div className="mt-6 flex w-full flex-1 flex-col gap-3 overflow-auto px-12">
            {type === 'MAJOR_ELECTIVE' && (
              <div className="flex gap-1.5">
                {gradeSelection.map((grades) => (
                  <GradeChip
                    onClickGradeChip={onClickGradeChip ? onClickGradeChip(grades) : () => {}}
                    key={grades.join(', ')}
                    isSelected={grades.some((grade) => selectedGrades.includes(grade))}
                    grades={grades}
                  />
                ))}
              </div>
            )}
            <motion.div
              key={selectedGrades.join(',')}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="overflow-auto"
            >
              <div className="flex flex-1 flex-col gap-3.5">
                {courses.map((course) => (
                  <CourseListItem
                    onClickCourseItem={onClickCourseItem ?? (() => {})}
                    isSelected={selectedCourses.some((selectedCourse) =>
                      isSameCourse(course, selectedCourse),
                    )}
                    key={course.courseName}
                    course={course}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-3 px-12">
        <span className="text-base font-light">
          현재{' '}
          <span className="text-[#6B5CFF]">
            {totalCredit ? Object.values(totalCredit).reduce((acc, item) => acc + item) : 0}학점
          </span>{' '}
          선택했어요
        </span>
        <div className="flex w-full items-center justify-center gap-3">
          {type === 'MAJOR_ELECTIVE' && <ViewSelectedCoursesButton />}
          <button
            type="button"
            className="bg-primary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
            onClick={onNextClick}
          >
            {courseSelectionInfo[type].text[coursesState].okText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseSelectionSkeleton;
