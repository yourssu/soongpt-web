import { useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { SelectableCourseItem } from '@/components/CourseItem/SelectableCourseItem';
import { CourseType } from '@/schemas/courseSchema';

type RetakeCourseType = CourseType & { currentGrade: string };

const MOCK_RETAKE_COURSES: RetakeCourseType[] = [
  {
    category: 'MAJOR_REQUIRED',
    subCategory: null,
    field: null,
    code: 10001,
    name: '선형대수',
    professor: ['나현숙', '박중석'],
    department: '컴퓨터공학부',
    division: null,
    time: 2,
    point: 2,
    personeel: 30,
    scheduleRoom: '공학관 101',
    target: '전체 학년',
    currentGrade: 'C+ 이하',
  },
  {
    category: 'MAJOR_REQUIRED',
    subCategory: null,
    field: null,
    code: 10002,
    name: '컴퓨터구조',
    professor: ['김철홍'],
    department: '컴퓨터공학부',
    division: null,
    time: 3,
    point: 2,
    personeel: 25,
    scheduleRoom: '공학관 202',
    target: '3학년',
    currentGrade: 'F',
  },
  {
    category: 'MAJOR_ELECTIVE',
    subCategory: null,
    field: null,
    code: 10003,
    name: '운영체제',
    professor: ['김철홍'],
    department: '컴퓨터공학부',
    division: null,
    time: 3,
    point: 3,
    personeel: 20,
    scheduleRoom: '공학관 303',
    target: '3학년',
    currentGrade: 'D+',
  },
];

export const CourseMajorRequiredActivity = () => {
  const [selectedCodes, setSelectedCodes] = useState<Set<number>>(new Set());

  const totalCredits = MOCK_RETAKE_COURSES.filter((course) =>
    selectedCodes.has(course.code),
  ).reduce((sum, course) => sum + course.point, 0);

  const handleToggle = (course: CourseType) => {
    setSelectedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(course.code)) {
        next.delete(course.code);
      } else {
        next.add(course.code);
      }
      return next;
    });
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={25} />
          <div className="mt-6 flex w-full flex-col">
            <div className="text-[28px]/[normal] font-semibold break-keep">
              26-1에
              <br />
              재수강할 과목을 담아주세요!
            </div>
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
            <div className="flex flex-col gap-4">
              <p className="text-neutral text-[20px] font-medium tracking-[-0.4px]">
                🟣 재수강 가능 과목
              </p>
              <div className="text-neutral text-[14px] font-light tracking-[-0.28px]">
                <p className="leading-4">* C +이하의 성적을 받은 과목 중,</p>
                <p className="leading-4">{'   '}26-1에 개설된 과목만 담을 수 있어요.</p>
                <p className="mt-2 leading-6">* 재수강 가능 횟수는 8번이에요.</p>
              </div>
            </div>
            {MOCK_RETAKE_COURSES.length === 0 ? (
              <div className="flex flex-1 items-center justify-center rounded-[20px] bg-white">
                <p className="text-[20px] font-medium tracking-[-0.4px] text-[#acacac]">
                  재수강 가능한 과목이 없어요.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {MOCK_RETAKE_COURSES.map((course) => (
                  <SelectableCourseItem
                    course={course}
                    extraBadge={
                      <span className="text-neutral flex h-6 items-center rounded-lg bg-[#eaeaea] px-2 text-[12px]">
                        {course.currentGrade}
                      </span>
                    }
                    isSelected={selectedCodes.has(course.code)}
                    key={course.code}
                    onClickCourseItem={handleToggle}
                  />
                ))}
              </div>
            )}
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[16px] leading-6 text-[#acacac]">
              현재 {totalCredits}학점 선택했어요.
            </p>
            <button
              className="bg-brandPrimary h-14 w-full rounded-2xl font-semibold text-white"
              type="button"
            >
              전공과목 담으러 가기
            </button>
          </div>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
