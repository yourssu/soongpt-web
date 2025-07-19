import { motion } from 'motion/react';
import { ReactElement, useContext } from 'react';

import Like from '@/assets/like.svg';
import CourseListItem from '@/components/CourseListItem';
import GradeChip from '@/components/GradeChip';
import ViewSelectedCoursesButton from '@/components/ViewSelectedCoursesButton';
import { CourseTypeContext } from '@/contexts/CourseTypeContext';
import { ArrayState, useGetArrayState } from '@/hooks/useGetArrayState';
import { Course } from '@/schemas/courseSchema';
import { Grade } from '@/schemas/studentSchema';
import { courseSelectionInfo, gradeSelection } from '@/types/courseSelectionInfo';
import { isSameCourse } from '@/utils/course';

interface CourseSelectionSkeletonProps {
  courses: Course[];
  description?: string;
  image?: string;
  onClickCourseItem?: (course: Course) => void;
  onClickGradeChip?: (grades: Grade[]) => () => void;
  onNextClick?: () => void;
  resultState: ArrayState;
  selectedCourses: Course[];
  selectedGrades: Grade[];
  title: string;
  totalCredit?: {
    GENERAL_REQUIRED: number;
    MAJOR_ELECTIVE: number;
    MAJOR_REQUIRED: number;
  };
}

const CourseSelectionView = ({
  resultState,
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
  const coursesState = useGetArrayState(courses);

  const courseListElement: Record<ArrayState, ReactElement> = {
    FILLED: (
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="overflow-auto"
        initial={{ y: 20, opacity: 0 }}
        key={selectedGrades.join(',')}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex flex-1 flex-col gap-3.5">
          {courses.map((course) => (
            <CourseListItem
              course={course}
              isSelected={selectedCourses.some((selectedCourse) =>
                isSameCourse(course, selectedCourse),
              )}
              key={course.courseName}
              onClickCourseItem={onClickCourseItem ?? (() => {})}
            />
          ))}
        </div>
      </motion.div>
    ),
    EMPTY: (
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-1 flex-col"
        initial={{ y: 20, opacity: 0 }}
        key={selectedGrades.join(',')}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="flex w-full flex-1 place-items-center">
          <div className="spacing flex w-full flex-col place-items-center gap-4">
            <span className="text-xl font-semibold tracking-tighter">
              해당 학년은 전공선택 과목이 없어요.
            </span>
            <img alt={'like'} src={Like} width={100} />
          </div>
        </div>
      </motion.div>
    ),
  };

  return (
    <motion.div
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-1 flex-col items-center gap-6 overflow-auto"
      initial={{ y: 20, opacity: 0 }}
      key={type}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex w-full flex-1 flex-col items-center overflow-auto">
        <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
          {title}
        </h2>
        <span className="items mt-1 font-light">{description}</span>
        {image ? (
          <img alt="L-Like" className="my-auto" src={image} />
        ) : (
          <div className="mt-6 flex w-full flex-1 flex-col gap-3 overflow-auto px-12">
            {type === 'MAJOR_ELECTIVE' && (
              <div className="flex gap-1.5">
                {gradeSelection.map((grades) => (
                  <GradeChip
                    grades={grades}
                    isSelected={grades.some((grade) => selectedGrades.includes(grade))}
                    key={grades.join(', ')}
                    onClickGradeChip={onClickGradeChip ? onClickGradeChip(grades) : () => {}}
                  />
                ))}
              </div>
            )}

            {courseListElement[coursesState]}
          </div>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-3 px-12">
        <span className="text-base font-light">
          현재{' '}
          <span className="text-brandPrimary">
            {totalCredit ? Object.values(totalCredit).reduce((acc, item) => acc + item) : 0}학점
          </span>{' '}
          선택했어요
        </span>
        <div className="flex w-full items-center justify-center gap-3">
          {type === 'MAJOR_ELECTIVE' && <ViewSelectedCoursesButton />}
          <button
            className="bg-brandPrimary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
            onClick={onNextClick}
            type="button"
          >
            {courseSelectionInfo[type].text[resultState].okText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseSelectionView;
