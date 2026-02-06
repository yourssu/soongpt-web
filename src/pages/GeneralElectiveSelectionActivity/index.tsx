import { useFlow } from '@stackflow/react/future';
import { useMemo, useState } from 'react';

import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { BottomSheet, BottomSheetState } from '@/components/BottomSheet';
import { SelectableChip } from '@/components/Chip/SelectableChip';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { Timetable } from '@/components/Timetable';
import { GeneralElectiveCourseItem } from '@/pages/GeneralElectiveSelectionActivity/components/GeneralElectiveCourseItem';
import { useSuspenseGetGeneralElectiveCourses } from '@/pages/GeneralElectiveSelectionActivity/hooks/useSuspenseGetGeneralElectiveCourses';
import { useSuspenseGetGeneralElectiveProgress } from '@/pages/GeneralElectiveSelectionActivity/hooks/useSuspenseGetGeneralElectiveProgress';
import { CourseType } from '@/schemas/courseSchema';
import { TimetableType } from '@/schemas/timetableSchema';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import { isSameCourseCode } from '@/utils/course';
import { mergeTimetableCourses, toTimetableCourse } from '@/utils/timetableSelection';

const chipValuesAfter23 = [
  '인간・언어',
  '문화・예술',
  '사회・정치・경제',
  '과학・기술',
  'Bridge 교과',
  '자기개발・진로탐색',
];

const chipValuesBefore22 = [
  '인성과 리더십',
  '자기계발과 진로탐색',
  '한국어의사소통',
  '국제어문',
  '자연과학・공학・기술',
  '역사・철학・종교',
  '정치・경제・경영',
  '사회・문화・심리',
  '문학・예술',
];

const previewTimetable: TimetableType = {
  timetableId: 1,
  tag: '기본 태그',
  score: null,
  totalPoint: 21,
  courses: [
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 9000000001,
      name: '컴퓨터학개론',
      professor: [],
      department: '교양교육운영팀',
      division: null,
      time: 0,
      point: 3,
      personeel: 0,
      scheduleRoom: '',
      target: '',
      courseTimes: [
        { week: '화', start: '11:00', end: '12:15', classroom: '' },
        { week: '목', start: '11:00', end: '12:15', classroom: '' },
      ],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 9000000002,
      name: '건축학개론',
      professor: [],
      department: '교양교육운영팀',
      division: null,
      time: 0,
      point: 2,
      personeel: 0,
      scheduleRoom: '',
      target: '',
      courseTimes: [
        { week: '월', start: '11:00', end: '12:15', classroom: '' },
        { week: '금', start: '11:00', end: '12:15', classroom: '' },
      ],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 9000000003,
      name: '섬김의리더십',
      professor: [],
      department: '교양교육운영팀',
      division: null,
      time: 0,
      point: 2,
      personeel: 0,
      scheduleRoom: '',
      target: '',
      courseTimes: [{ week: '수', start: '10:00', end: '11:15', classroom: '' }],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 9000000004,
      name: '데이터과학입문',
      professor: [],
      department: '교양교육운영팀',
      division: null,
      time: 0,
      point: 2,
      personeel: 0,
      scheduleRoom: '',
      target: '',
      courseTimes: [{ week: '화', start: '14:00', end: '15:00', classroom: '' }],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 9000000005,
      name: '글로벌경제',
      professor: [],
      department: '교양교육운영팀',
      division: null,
      time: 0,
      point: 2,
      personeel: 0,
      scheduleRoom: '',
      target: '',
      courseTimes: [{ week: '목', start: '14:00', end: '15:00', classroom: '' }],
    },
  ],
};

const renderProgressText = (progress: ReturnType<typeof useSuspenseGetGeneralElectiveProgress>) => {
  if (progress.scheme === '23+') {
    const [human, culture, society, science, bridge, self] = progress.fieldCredits;

    return (
      <div className="text-sm leading-tight font-light">
        <p>
          * 교양필수{' '}
          <span className="font-semibold">
            {progress.requiredCredits}학점 중 {progress.completedCredits}학점
          </span>{' '}
          이수했어요.
        </p>
        <p>
          * 인간 {human?.completedCredits ?? 0}학점 / 문화{' '}
          <span className="font-semibold">{culture?.completedCredits ?? 0}학점</span> / 사회{' '}
          <span className="font-semibold">{society?.completedCredits ?? 0}학점</span> / 과학{' '}
          {science?.completedCredits ?? 0}학점
        </p>
        <p>
          / Bridge 교과 {bridge?.completedCredits ?? 0}학점 / 자기개발 {self?.completedCredits ?? 0}
          학점
        </p>
        <p>* 1~5영역에서 {progress.minFieldsRequired}개 영역 이상 이수해야해요.</p>
      </div>
    );
  }

  const coreSummary = progress.coreAreas
    .map((area) => `${area.label} ${area.completedCount}과목`)
    .join(' / ');
  const balance = progress.balanceAreas.find((area) => area.completedCount > 0);

  return (
    <div className="text-sm leading-tight font-light">
      <p>
        * 교양필수{' '}
        <span className="font-semibold">
          {progress.requiredCourseCount}과목 중 {progress.completedCourseCount}과목
        </span>{' '}
        이수했어요.
      </p>
      <p>* {coreSummary} /</p>
      <p>
        * 균형교양교과{' '}
        <span className="font-semibold">
          {balance?.completedCount ?? 0}과목({balance?.label ?? '문학・예술'})
        </span>
      </p>
      <p>
        * 숭실품성교과, 기초역량교과에서 각 1과목씩 총 2과목,
        <br />
        균형교양교과에서 {progress.requiredBalanceAreaCount}개 영역을 선택하여 각 1과목씩
        <br />총 2과목 이수해야해요.
      </p>
    </div>
  );
};

const getCourseField = (course: CourseType) => course.field ?? '';

export const GeneralElectiveSelectionActivity = () => {
  const { push } = useFlow();
  const { schoolId } = useAssertedStudentInfoContext();
  const isAfter23 = schoolId >= 23;
  const { selectedTimetable, selectedGeneralElectives, setSelectedGeneralElectives } =
    useSelectedTimetableContext();

  const courses = useSuspenseGetGeneralElectiveCourses();
  const progress = useSuspenseGetGeneralElectiveProgress();

  const chipValues = isAfter23 ? chipValuesAfter23 : chipValuesBefore22;

  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [sheetState, setSheetState] = useState<BottomSheetState>('peek');

  const filteredCourses = useMemo(() => {
    if (selectedFields.length === 0) {
      return courses;
    }

    return courses.filter((course) => selectedFields.includes(getCourseField(course)));
  }, [courses, selectedFields]);

  const handleChipClick = (value: string, selected: boolean) => {
    if (selected) {
      setSelectedFields((prev) => [...prev, value]);
    } else {
      setSelectedFields((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleCourseSelect = (course: CourseType) => {
    setSelectedGeneralElectives((prev) => {
      const exists = prev.some((item) => isSameCourseCode(item.code, course.code));
      if (exists) {
        return prev.filter((item) => !isSameCourseCode(item.code, course.code));
      }
      return [...prev, toTimetableCourse(course)];
    });
  };

  const previewTimetableData = useMemo(() => {
    if (!selectedTimetable) {
      return previewTimetable;
    }
    return mergeTimetableCourses(selectedTimetable, selectedGeneralElectives);
  }, [selectedGeneralElectives, selectedTimetable]);

  const isSheetOpen = sheetState === 'open';

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea
        className="bg-[#f9f9f9]"
        onScroll={(event) => {
          const target = event.currentTarget;
          if (target.scrollTop > 24 && !isSheetOpen) {
            setSheetState('open');
          }
        }}
      >
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.general_elective_selection} />
          <div className="mt-6 flex w-full flex-col gap-4">
            <h2 className="text-[28px]/[normal] font-semibold">
              26-1에 이수할
              <br />
              교양선택 과목을 담아주세요!
            </h2>
            {renderProgressText(progress)}
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body className="gap-6 pt-6 pb-[140px]">
          <div className="flex w-full justify-center">
            <div className="w-[303px]">
              <Timetable
                tagPointOverride={21}
                tagTitleOverride="시간표 이름"
                timetable={previewTimetableData}
              />
            </div>
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>

      <BottomSheet
        className="w-full rounded-t-[24px] bg-[#f9f9f9] px-6 pt-4 pb-10 shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)]"
        containerClassName="fixed bottom-0 left-1/2 w-full max-w-[500px] -translate-x-1/2"
        dragElastic={0.2}
        dragHandleOnly
        getNextState={({ maxOffset, currentY, info }) => {
          const shouldClose = info.velocity.y > 600 || currentY > maxOffset * 0.5;
          return shouldClose ? 'peek' : 'open';
        }}
        onStateChange={setSheetState}
        peekHeight={84}
        renderHandle={() => <div className="h-1 w-8 rounded-full bg-[#b5b9c4]" />}
        state={sheetState}
      >
        <div className="flex items-center gap-2">
          <span className="bg-brandPrimary inline-block size-3 rounded-full" />
          <span className="text-xl font-semibold">교양선택 과목</span>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          {chipValues.map((value) => {
            const selected = selectedFields.includes(value);
            return (
              <SelectableChip
                className={
                  selected
                    ? 'border-brandPrimary text-brandPrimary border bg-white px-[14px] py-[10px] text-[12px]'
                    : 'border-neutralPlaceholder text-neutralPlaceholder border bg-white px-[14px] py-[10px] text-[12px]'
                }
                key={value}
                onSelectChange={(nextSelected) => handleChipClick(value, nextSelected)}
                selected={selected}
              >
                {value}
              </SelectableChip>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {filteredCourses.map((course) => {
            const isSelected = selectedGeneralElectives.some((item) =>
              isSameCourseCode(item.code, course.code),
            );
            return (
              <GeneralElectiveCourseItem
                course={course}
                isSelected={isSelected}
                key={course.code}
                onClick={() => handleCourseSelect(course)}
              />
            );
          })}
        </div>

        <button
          className="bg-brandPrimary mt-6 w-full rounded-2xl py-3.5 font-semibold text-white"
          onClick={() => push('chapel_selection', { timetableId: selectedTimetable?.timetableId })}
          type="button"
        >
          채플 담으러 가기
        </button>
      </BottomSheet>
    </ActivityLayout>
  );
};
