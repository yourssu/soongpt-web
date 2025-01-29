import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import CourseListItem, { Course } from '../components/CourseListItem.tsx';
import { useState } from 'react';

const courses: Course[] = [
  {
    courseId: '1',
    name: '자료구조',
    professors: ['나현숙'],
    credit: 3,
  },
  {
    courseId: '2',
    name: '선형대수',
    professors: ['나현숙, 박중석'],
    credit: 2,
  },
  {
    courseId: '3',
    name: '자료구조',
    professors: ['나현숙, 박중석'],
    credit: 2,
  },
  {
    courseId: '4',
    name: '객체 지향 프로그래밍',
    professors: ['나현숙, 박중석'],
    credit: 2,
  },
  {
    courseId: '5',
    name: '객체 지향 프로그래밍',
    professors: ['나현숙, 박중석'],
    credit: 2,
  },
];

const CourseSelectionActivity: ActivityComponentType = () => {
  const [totalCredit, setTotalCredit] = useState(0);

  const addCredit = (credit: number) => {
    setTotalCredit(totalCredit + credit);
  };

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-center text-[28px]/[normal] font-semibold">
            이번 학기에 이수해야 하는
            <br />
            전공필수과목이에요.
          </h2>
          <span className="items mt-1 font-light">잘못되었다면 이수할 과목만 선택해주세요!</span>
          <div className="mt-12 w-full px-12">
            <div className="max-h-h-course-list-4 flex flex-col gap-3.5 overflow-auto">
              {courses.map((course) => (
                <CourseListItem addCredit={addCredit} key={course.courseId} course={course} />
              ))}
            </div>
          </div>
          <span className="mt-16 text-base font-light">
            현재 <span className="text-[#6B5CFF]">{totalCredit}학점</span> 선택했어요
          </span>
          <button
            type="button"
            className="bg-progress-bar mt-3 w-50 rounded-2xl py-3.5 font-semibold text-white"
          >
            확인했어요
          </button>
        </div>
      </div>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
