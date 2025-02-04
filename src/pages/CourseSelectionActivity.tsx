import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import CourseListItem from '../components/CourseListItem.tsx';
import { useState } from 'react';
import { useFlow, useStepFlow } from '../stackflow.ts';
import { AnimatePresence, motion } from 'motion/react';
import { CourseType } from '../type/course.type.ts';
import { courseSelection } from '../constant/course.constant.ts';

interface CourseSelectionActivityParams {
  type: CourseType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [totalCredit, setTotalCredit] = useState<{ [K in CourseType]: number }>({
    majorRequired: 0,
    majorElective: 0,
    generalRequired: 0,
  });

  const { stepPush } = useStepFlow('CourseSelectionActivity');
  const { push } = useFlow();

  const onNextClick = () => {
    if (courseSelection[params.type].next) {
      stepPush({
        type: courseSelection[params.type].next,
      } as CourseSelectionActivityParams);
      return;
    }

    push('DesiredCreditActivity', totalCredit);
  };

  const courses = courseSelection[params.type].courses;

  const onClickCourseItem = (courseId: string) => {
    const credit = courses.find((course) => course.courseId === courseId)?.credit ?? 0;

    setSelectedCourseIds((prevState) => {
      if (prevState.includes(courseId)) {
        setTotalCredit({ ...totalCredit, [params.type]: totalCredit[params.type] - credit });
        return prevState.filter((prevCourseId) => prevCourseId !== courseId);
      } else {
        setTotalCredit({ ...totalCredit, [params.type]: totalCredit[params.type] + credit });
        return [...prevState, courseId];
      }
    });
  };

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <div className="min-h-screen py-12">
          <AppBar progress={courseSelection[params.type].progress} />
          <motion.div
            key={params.type}
            className="mt-15 flex flex-col items-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
              {courseSelection[params.type].title}
            </h2>
            <span className="items mt-1 font-light">
              {courseSelection[params.type].description}
            </span>
            <div className="mt-12 w-full px-12">
              <div className="max-h-h-course-list-4 flex flex-col gap-3.5 overflow-auto">
                {courses.map((course) => (
                  <CourseListItem
                    onClickCourseItem={onClickCourseItem}
                    isSelected={selectedCourseIds.includes(course.courseId)}
                    key={course.courseId}
                    course={course}
                  />
                ))}
              </div>
            </div>
            <span className="mt-16 text-base font-light">
              현재{' '}
              <span className="text-[#6B5CFF]">
                {Object.values(totalCredit).reduce((acc, item) => acc + item)}학점
              </span>{' '}
              선택했어요
            </span>
            <button
              type="button"
              className="bg-primary mt-3 w-50 rounded-2xl py-3.5 font-semibold text-white"
              onClick={onNextClick}
            >
              확인했어요
            </button>
          </motion.div>
        </div>
      </AnimatePresence>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
