import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import CourseListItem from '../components/CourseListItem.tsx';
import { useState } from 'react';
import { useFlow, useStepFlow } from '../stackflow.ts';
import { AnimatePresence, motion } from 'motion/react';
import { CourseType } from '../type/course.type.ts';
import { courseSelection, gradeSelection } from '../data/courseSelection.ts';
import GradeChip from '../components/GradeChip.tsx';
import ViewSelectedCoursesButton from '../components/ViewSelectedCoursesButton.tsx';
import { CourseListContext } from '../context/CourseListContext.ts';
import { useGetCourses } from '../hooks/useGetCourses.ts';
import { Course } from '../schemas/courseSchema.ts';
import { useMemo } from 'react';
import _ from 'lodash';
import { Grade } from '../schemas/studentSchema.ts';
import { StudentMachineContext } from '../machines/studentMachine.ts';

interface CourseSelectionActivityParams {
  type: CourseType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const state = StudentMachineContext.useSelector((state) => state);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [totalCredit, setTotalCredit] = useState<{ [K in CourseType]: number }>({
    majorRequired: 0,
    majorElective: 0,
    generalRequired: 0,
  });

  const { stepPush } = useStepFlow('CourseSelectionActivity');
  const { push } = useFlow();

  const onNextClick = () => {
    console.log(selectedCourses);

    if (courseSelection[params.type].next) {
      stepPush({
        type: courseSelection[params.type].next,
      } as CourseSelectionActivityParams);
      return;
    }

    push('DesiredCreditActivity', {
      majorRequiredCourses: selectedCourses
        .filter(({ classification }) => classification === 'MAJOR_REQUIRED')
        .map(({ courseName }) => courseName),
      majorElectiveCourses: selectedCourses
        .filter(({ classification }) => classification === 'MAJOR_ELECTIVE')
        .map(({ courseName }) => courseName),
      generalRequiredCourses: selectedCourses
        .filter(({ classification }) => classification === 'GENERAL_REQUIRED')
        .map(({ courseName }) => courseName),
      ...totalCredit,
    });
  };

  const onClickCourseItem = (course: Course) => {
    const credit =
      courses.find(
        ({ courseName, professorName }) =>
          course.courseName === courseName && course.professorName === professorName,
      )?.credit ?? 0;

    setSelectedCourses((prevState) => {
      if (
        prevState.find(
          ({ courseName, professorName }) =>
            course.courseName === courseName && course.professorName === professorName,
        )
      ) {
        setTotalCredit({ ...totalCredit, [params.type]: totalCredit[params.type] - credit });
        return prevState.filter(
          ({ courseName, professorName }) =>
            course.courseName !== courseName || course.professorName !== professorName,
        );
      } else {
        setTotalCredit({ ...totalCredit, [params.type]: totalCredit[params.type] + credit });
        return [...prevState, course];
      }
    });
  };

  const [selectedGrades, setSelectedGrades] = useState([state.context.grade]);

  const onClickGradeChip = (grades: Grade[]) => () => {
    setSelectedGrades(grades);
  };

  const {
    [params.type]: { data },
  } = useGetCourses({
    schoolId: state.context.admissionYear,
    grade: state.context.grade,
    department: state.context.department,
  });

  const courses = useMemo<Course[]>(() => {
    if (!data?.result) return [];

    const groupedCourses = _.groupBy(data.result, 'courseName');

    const courses = _.map(groupedCourses, (courses: Course[]) => {
      const baseData = { ...courses[0] };

      const professors = _.uniq(
        _.map(courses, 'professorName').filter((name) => name && name.trim() !== ''),
      );

      baseData.professorName = professors.length > 0 ? professors.join(', ') : '';

      return baseData;
    });

    if (params.type === 'majorElective') {
      return courses.filter((course) =>
        selectedGrades.some((grade) =>
          course.target.includes(`${state.context.department}${grade}`),
        ),
      );
    }

    return courses;
  }, [data?.result, params.type, selectedGrades, state.context.department]);

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <CourseListContext.Provider value={selectedCourses}>
          <div className="flex max-h-screen min-h-screen flex-col gap-15 py-12">
            <AppBar progress={courseSelection[params.type].progress} />
            <motion.div
              key={params.type}
              className="flex flex-1 flex-col items-center gap-16 overflow-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
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
                      {gradeSelection.map((grades) => (
                        <GradeChip
                          onClickGradeChip={onClickGradeChip(grades)}
                          key={grades.join(', ')}
                          isSelected={grades.join(',') === selectedGrades.join(',')}
                          grades={grades}
                        />
                      ))}
                    </div>
                  )}
                  <div className="overflow-auto">
                    <div className="flex flex-1 flex-col gap-3.5">
                      {courses.map((course) => (
                        <CourseListItem
                          onClickCourseItem={onClickCourseItem}
                          isSelected={
                            !!selectedCourses.find(
                              ({ courseName, professorName }) =>
                                course.courseName === courseName &&
                                course.professorName === professorName,
                            )
                          }
                          key={course.courseName}
                          course={course}
                        />
                      ))}
                    </div>
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
