import _ from 'lodash';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { CourseListContext } from '@/contexts/CourseListContext';
import { CourseTypeContext } from '@/contexts/CourseTypeContext';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { useGetCourses } from '@/hooks/useGetCourses';
import CourseSelectionView from '@/pages/CourseSelectionActivity/components/CourseSelectionView';
import { Course } from '@/schemas/courseSchema';
import { Grade } from '@/schemas/studentSchema';
import { useFlow, useStepFlow } from '@/stackflow';
import { CourseType } from '@/types/course';
import { courseSelectionInfo, gradeSelection } from '@/types/courseSelectionInfo';
import { isSameCourse } from '@/utils/course';

const CourseSelection = () => {
  const state = StudentMachineContext.useSelector((state) => state);
  const [selectedGrades, setSelectedGrades] = useState([state.context.grade]);
  const type = useContext(CourseTypeContext);

  const {
    [type]: { data, arrayState: resultState },
  } = useGetCourses({
    schoolId: state.context.admissionYear,
    grade: state.context.grade,
    department: state.context.department,
  });

  const courses = useMemo<Course[]>(() => {
    if (data === undefined) {
      return [];
    }

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
        gradeSelection
          .filter((grades) => grades.some((grade) => selectedGrades.includes(grade)))
          .flat()
          .some((grade) => course.target.includes(`${state.context.department}${grade}`)),
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
    let courses = [];

    if (courseSelectionInfo[type].next) {
      stepPush({
        type: courseSelectionInfo[type].next,
      });

      courses = selectedCourses
        .filter((course) => course.classification === type)
        .map((course) => course.courseName);
    } else {
      const majorRequiredCourses = selectedCourses
        .filter((course) => course.classification === 'MAJOR_REQUIRED')
        .map((course) => course.courseName);
      const majorElectiveCourses = selectedCourses
        .filter((course) => course.classification === 'MAJOR_ELECTIVE')
        .map((course) => course.courseName);
      const generalRequiredCourses = selectedCourses
        .filter((course) => course.classification === 'GENERAL_REQUIRED')
        .map((course) => course.courseName);

      courses = majorElectiveCourses;

      push('DesiredCreditActivity', {
        majorRequiredCourses,
        majorElectiveCourses,
        generalRequiredCourses,
        majorRequired: totalCredit['MAJOR_REQUIRED'],
        generalRequired: totalCredit['GENERAL_REQUIRED'],
        majorElective: totalCredit['MAJOR_ELECTIVE'],
      });
    }

    // Mixpanel 이벤트 추적
    Mixpanel.trackCourseSelectionClick(type, courses);
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

  const initRef = useRef(false);

  useEffect(() => {
    if (type === 'MAJOR_REQUIRED' && courses.length > 0 && !initRef.current) {
      setSelectedCourses((prevState) => [...prevState, ...courses]);
      setTotalCredit((prevState) => ({
        ...prevState,
        [type]: courses.reduce((acc, course) => acc + course.credit, 0),
      }));
      initRef.current = true;
    }
  }, [courses, type]);

  return (
    <CourseListContext.Provider value={selectedCourses}>
      <CourseSelectionView
        courses={courses}
        description={courseSelectionInfo[type].text[resultState].description}
        image={courseSelectionInfo[type].text[resultState].image}
        onClickCourseItem={onClickCourseItem}
        onClickGradeChip={onClickGradeChip}
        onNextClick={onNextClick}
        resultState={resultState}
        selectedCourses={selectedCourses}
        selectedGrades={selectedGrades}
        title={courseSelectionInfo[type].text[resultState].title}
        totalCredit={totalCredit}
      />
    </CourseListContext.Provider>
  );
};

export default CourseSelection;
