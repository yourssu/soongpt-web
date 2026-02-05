import clsx from 'clsx';
import { useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';

interface CourseRetakeCardProps {
  active: boolean;
  credits: number;
  grade: string;
  name: string;
  onClick?: () => void;
  professor: string;
  recommendedYear: number;
}

const CourseRetakeCard = ({
  name,
  professor,
  active,
  grade,
  credits,
  onClick,
}: CourseRetakeCardProps) => {
  return (
    <button
      className={clsx(
        'flex w-full items-center gap-[7px] rounded-[20px] bg-white p-4 text-left',
        active ? 'border-brandPrimary border' : 'border border-transparent',
      )}
      onClick={onClick}
      type="button"
    >
      <div
        className={clsx(
          'flex min-w-0 flex-1 flex-col leading-6',
          active ? 'text-brandPrimary' : 'text-neutral',
        )}
      >
        <span className="text-[20px] font-medium tracking-[-0.4px]">{name}</span>
        <span className="text-[12px] tracking-[-0.24px]">{professor} 교수님</span>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <span className="text-neutral flex h-6 items-center rounded-lg bg-[#eaeaea] px-2 text-[12px]">
          {grade}
        </span>
        <span className="bg-bg-brandLayerLight text-brandSecondary flex h-6 items-center rounded-lg px-2 text-[12px] font-medium">
          {credits}학점
        </span>
      </div>
    </button>
  );
};

const MOCK_RETAKE_COURSES = [
  {
    id: 1,
    name: '선형대수',
    professor: '나현숙, 박중석',
    grade: 'C+ 이하',
    credits: 2,
    recommendedYear: 2,
  },
  { id: 2, name: '컴퓨터구조', professor: '김철홍', grade: 'F', credits: 2, recommendedYear: 3 },
  { id: 3, name: '컴퓨터구조', professor: '김철홍', grade: 'F', credits: 2, recommendedYear: 3 },
];

export const CourseRetakeActivity = () => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const totalCredits = MOCK_RETAKE_COURSES.filter((course) => selectedIds.has(course.id)).reduce(
    (sum, course) => sum + course.credits,
    0,
  );

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
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
          <div className="flex w-full flex-col gap-4">
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

            <div className="flex flex-col gap-2">
              {MOCK_RETAKE_COURSES.map((course) => (
                <CourseRetakeCard
                  active={selectedIds.has(course.id)}
                  credits={course.credits}
                  grade={course.grade}
                  key={course.id}
                  name={course.name}
                  onClick={() => handleToggle(course.id)}
                  professor={course.professor}
                  recommendedYear={course.recommendedYear}
                />
              ))}
            </div>
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[16px] leading-6 text-[#acacac]">
              현재 {totalCredits} 학점 선택했어요.
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
