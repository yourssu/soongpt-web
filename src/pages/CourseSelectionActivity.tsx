import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import _ from 'lodash';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import AppBar from '../components/AppBar';
import CourseListItem from '../components/CourseListItem.tsx';
import GradeChip from '../components/GradeChip.tsx';
import ViewSelectedCoursesButton from '../components/ViewSelectedCoursesButton.tsx';
import { CourseListContext } from '../context/CourseListContext.ts';
import { courseSelection, gradeSelection } from '../data/courseSelection.ts';
import { useGetCourses } from '../hooks/useGetCourses.ts';
import { StudentMachineContext } from '../machines/studentMachine.ts';
import { Course } from '../schemas/courseSchema.ts';
import { Grade } from '../schemas/studentSchema.ts';
import { useFlow, useStepFlow } from '../stackflow.ts';
import { CourseType } from '../type/course.type.ts';

const isSameCourse = (a: Course, b: Course) =>
  a.courseName === b.courseName && a.professorName === b.professorName;

interface CourseSelectionActivityParams {
  type?: CourseType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const state = StudentMachineContext.useSelector((state) => state);
  const type = params.type ?? 'MAJOR_REQUIRED';
  const [selectedGrades, setSelectedGrades] = useState([state.context.grade]);

  const {
    [type]: { data },
  } = useGetCourses({
    schoolId: state.context.admissionYear,
    grade: state.context.grade,
    department: state.context.department,
  });

  const courses = useMemo<Course[]>(() => {
    if (data === undefined) return [];

    const groupedCourses = _.groupBy(data.result, 'courseName');

    const courses = _.map(groupedCourses, (courses: Course[]) => {
      const baseData = { ...courses[0] };

      const professors = _.uniq(
        _.map(courses, 'professorName').filter((name) => name && name.trim() !== ''),
      );

      baseData.professorName = professors.length > 0 ? professors.join(', ') : '';

      return baseData;
    });

    if (type === 'MAJOR_ELECTIVE') {
      return courses.filter((course) =>
        selectedGrades.some((grade) =>
          course.target.includes(`${state.context.department}${grade}`),
        ),
      );
    }

    return courses;
  }, [data, type, selectedGrades, state.context.department]);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [totalCredit, setTotalCredit] = useState<Record<CourseType, number>>({
    MAJOR_REQUIRED: 0,
    MAJOR_ELECTIVE: 0,
    GENERAL_REQUIRED: 0,
  });

  const { stepPush } = useStepFlow('CourseSelectionActivity');
  const { push } = useFlow();

  const onNextClick = () => {
    if (courseSelection[type].next) {
      stepPush({
        type: courseSelection[type].next,
      } as CourseSelectionActivityParams);

      return;
    }

    push('DesiredCreditActivity', {
      majorRequiredCourses: selectedCourses
        .filter((course) => course.classification === 'MAJOR_REQUIRED')
        .map((course) => course.courseName),
      majorElectiveCourses: selectedCourses
        .filter((course) => course.classification === 'MAJOR_ELECTIVE')
        .map((course) => course.courseName),
      generalRequiredCourses: selectedCourses
        .filter((course) => course.classification === 'GENERAL_REQUIRED')
        .map((course) => course.courseName),
      majorRequired: totalCredit['MAJOR_REQUIRED'],
      generalRequired: totalCredit['GENERAL_REQUIRED'],
      majorElective: totalCredit['MAJOR_ELECTIVE'],
    });
  };

  const onClickCourseItem = (course: Course) => {
    const credit = courses.find((c) => isSameCourse(c, course))?.credit ?? 0;
    setSelectedCourses((prevState) => {
      const isSelected = prevState.some((c) => isSameCourse(c, course));

      let newCredit = totalCredit[type];
      if (isSelected) {
        newCredit -= credit;
      } else {
        newCredit += credit;
      }
      setTotalCredit((prev) => ({
        ...prev,
        [type]: newCredit,
      }));

      return isSelected
        ? prevState.filter((c) => !isSameCourse(c, course))
        : [...prevState, course];
    });
  };

  const onClickGradeChip = (grades: Grade[]) => () => {
    setSelectedGrades(grades);
  };

  const initRef = useRef<Record<CourseType, boolean>>({
    MAJOR_REQUIRED: false,
    GENERAL_REQUIRED: false,
    MAJOR_ELECTIVE: false,
  });

  useEffect(() => {
    if (
      (type === 'MAJOR_REQUIRED' || type === 'GENERAL_REQUIRED') &&
      courses.length > 0 &&
      !initRef.current[type]
    ) {
      setSelectedCourses((prevState) => [...prevState, ...courses]);
      setTotalCredit((prevState) => ({
        ...prevState,
        [type]: courses.reduce((acc, course) => acc + course.credit, 0),
      }));
      initRef.current[type] = true;
    }
  }, [courses, type]);

  return (
    <AppScreen>
      <AnimatePresence mode="wait">
        <CourseListContext.Provider value={selectedCourses}>
          <div className="flex max-h-dvh min-h-dvh flex-col gap-6 py-12">
            <AppBar progress={courseSelection[type].progress} />
            <motion.div
              key={type}
              className="flex flex-1 flex-col items-center gap-6 overflow-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="flex w-full flex-1 flex-col items-center overflow-auto">
                <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
                  {courseSelection[type].title}
                </h2>
                <span className="items mt-1 font-light">{courseSelection[type].description}</span>
                <div className="mt-6 flex w-full flex-1 flex-col gap-3 overflow-auto px-12">
                  {type === 'MAJOR_ELECTIVE' && (
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
                          onClickCourseItem={onClickCourseItem}
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
                  {type === 'MAJOR_ELECTIVE' && <ViewSelectedCoursesButton />}
                  <button
                    type="button"
                    className="bg-primary max-w-52 flex-1 rounded-2xl py-3.5 font-semibold text-white"
                    onClick={onNextClick}
                  >
                    {courseSelection[type].okText}
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
