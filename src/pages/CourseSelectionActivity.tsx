import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import CourseListItem from '../components/CourseListItem.tsx';
import { useState } from 'react';
import { useFlow, useStepFlow } from '../stackflow.ts';
import { AnimatePresence, motion } from 'motion/react';
import { CourseType } from '../type/course.type.ts';
import { courseSelection } from '../constant/course.constant.ts';
import GradeChip from '../components/GradeChip.tsx';
import ViewSelectedCoursesButton from '../components/ViewSelectedCoursesButton.tsx';
import { CourseListContext } from '../context/CourseListContext.ts';

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

  const [selectedGrade, setSelectedGrade] = useState(
    (
      JSON.parse(localStorage.getItem('student') || '') as { context: { grade: number } }
    ).context.grade.toString(),
  );

  const onClickGradeChip = (grade: string) => () => {
    setSelectedGrade(grade);
  };

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <CourseListContext.Provider
          value={Object.values(courseSelection)
            .map((item) => item.courses)
            .flat()
            .filter(({ courseId }) => selectedCourseIds.includes(courseId))}
        >
          <div className="flex max-h-screen min-h-screen flex-col gap-15 py-12">
            <AppBar progress={courseSelection[params.type].progress} />
            <motion.div
              key={params.type}
              className="flex flex-1 flex-col items-center gap-16 overflow-auto"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex w-full flex-1 flex-col items-center overflow-auto">
                <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
                  {courseSelection[params.type].title}
                </h2>
                <span className="items mt-1 font-light">
                  {courseSelection[params.type].description}
                </span>
                <div className="mt-10 flex w-full flex-1 flex-col gap-3 overflow-auto px-12">
                  {params.type === 'majorElective' && (
                    <div className="flex gap-1.5">
                      {['1학년', '2학년', '3학년', '4,5학년'].map((grade) => (
                        <GradeChip
                          onClickGradeChip={onClickGradeChip(grade)}
                          key={grade}
                          isSelected={grade.includes(selectedGrade)}
                          grade={grade}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3.5 overflow-auto">
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
              </div>
              <div className="flex w-full flex-col items-center gap-3 px-12">
                <span className="text-base font-light">
                  현재{' '}
                  <span className="text-[#6B5CFF]">
                    {Object.values(totalCredit).reduce((acc, item) => acc + item)}학점
                  </span>{' '}
                  선택했어요
                </span>
                <div className="flex w-full items-center justify-center gap-3">
                  {params.type === 'majorElective' && <ViewSelectedCoursesButton />}
                  <button
                    type="button"
                    className="bg-primary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
                    onClick={onNextClick}
                  >
                    {courseSelection[params.type].okText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </CourseListContext.Provider>
      </AnimatePresence>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
