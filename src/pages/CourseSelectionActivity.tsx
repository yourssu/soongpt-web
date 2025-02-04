import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import AppBar from '../components/AppBar';
import CourseListItem, { Course } from '../components/CourseListItem.tsx';
import { useState } from 'react';
import { useFlow, useStepFlow } from '../stackflow.ts';

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

type CourseType = '전필' | '교필' | '전선';

interface CourseSelection {
  title: string;
  description: string;
  next: CourseType | null;
}

const courseSelection: { [key in CourseType]: CourseSelection } = {
  전필: {
    title: '이번 학기에 이수해야 하는\n전공필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    next: '교필',
  },
  교필: {
    title: '이번 학기에 이수해야 하는\n교양필수과목이에요.',
    description: '잘못되었다면 이수할 과목만 선택해주세요!',
    next: '전선',
  },
  전선: {
    title: '이번 학기에 이수할\n전공선택과목을 알려주세요!',
    description: '타학년 전공선택과목도 선택할 수 있어요.',
    next: null,
  },
};

interface CourseSelectionActivityParams {
  type: CourseType;
}

const CourseSelectionActivity: ActivityComponentType<CourseSelectionActivityParams> = ({
  params,
}) => {
  const [totalCredit, setTotalCredit] = useState(0);

  const { stepPush } = useStepFlow('CourseSelectionActivity');
  const { push } = useFlow();

  const onNextClick = () => {
    if (courseSelection[params.type].next) {
      stepPush({
        type: courseSelection[params.type].next,
      } as CourseSelectionActivityParams);
      return;
    }

    push('DesiredCreditActivity', {
      majorRequired: 6,
      majorElective: 5,
      generalRequired: 4,
    });
  };

  const addCredit = (credit: number) => {
    setTotalCredit(totalCredit + credit);
  };

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
            {courseSelection[params.type].title}
          </h2>
          <span className="items mt-1 font-light">{courseSelection[params.type].description}</span>
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
            className="bg-primary mt-3 w-50 rounded-2xl py-3.5 font-semibold text-white"
            onClick={onNextClick}
          >
            확인했어요
          </button>
        </div>
      </div>
    </AppScreen>
  );
};

export default CourseSelectionActivity;
