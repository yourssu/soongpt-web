import { useFlow } from '@stackflow/react/future';
import { useMutation } from '@tanstack/react-query';
import { Code } from 'lucide-react';
import { useState } from 'react';

import { postTimetable, TimetablePayloadType } from '@/api/timetables';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { useStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { STAGE } from '@/config';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useToast } from '@/hooks/useToast';
import { TimetableArrayResponseType, TimetableType } from '@/schemas/timetableSchema';
import { assertNonNullish } from '@/utils/assertion';

interface ToolItemProps {
  description?: string;
  onClick: () => void;
  title: string;
}

const MOCK_TIMETABLE_ID = 9999;

const MOCK_TIMETABLE: TimetableType = {
  timetableId: MOCK_TIMETABLE_ID,
  tag: '기본 태그',
  score: null,
  totalPoint: 21,
  courses: [
    {
      category: 'MAJOR_REQUIRED',
      subCategory: null,
      field: null,
      code: 2150545501,
      name: '컴퓨터학개론',
      professor: ['홍길동'],
      department: '컴퓨터학부',
      division: null,
      time: 0,
      point: 3,
      personeel: 50,
      scheduleRoom: '정보과학관 101',
      target: '전체',
      courseTimes: [
        { week: '월', start: '11:00', end: '12:00', classroom: '정보과학관 101' },
        { week: '목', start: '11:00', end: '12:00', classroom: '정보과학관 101' },
      ],
    },
    {
      category: 'MAJOR_ELECTIVE',
      subCategory: null,
      field: null,
      code: 2150225101,
      name: '자료구조',
      professor: ['김철수'],
      department: '컴퓨터학부',
      division: null,
      time: 0,
      point: 3,
      personeel: 60,
      scheduleRoom: '정보과학관 202',
      target: '전체',
      courseTimes: [{ week: '화', start: '11:00', end: '12:30', classroom: '정보과학관 202' }],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 2150145301,
      name: '교양철학',
      professor: ['이영희'],
      department: '인문대학',
      division: null,
      time: 0,
      point: 3,
      personeel: 80,
      scheduleRoom: '문화관 301',
      target: '전체',
      courseTimes: [{ week: '화', start: '14:00', end: '15:00', classroom: '문화관 301' }],
    },
    {
      category: 'GENERAL_ELECTIVE',
      subCategory: null,
      field: null,
      code: 2150143401,
      name: '심리학개론',
      professor: ['박민수'],
      department: '인문대학',
      division: null,
      time: 0,
      point: 3,
      personeel: 70,
      scheduleRoom: '문화관 205',
      target: '전체',
      courseTimes: [{ week: '목', start: '14:00', end: '15:00', classroom: '문화관 205' }],
    },
    {
      category: 'GENERAL_REQUIRED',
      subCategory: null,
      field: null,
      code: 2150102701,
      name: '기초통계',
      professor: ['최지훈'],
      department: '자연대학',
      division: null,
      time: 0,
      point: 3,
      personeel: 65,
      scheduleRoom: '자연관 112',
      target: '전체',
      courseTimes: [{ week: '금', start: '11:00', end: '12:00', classroom: '자연관 112' }],
    },
  ],
};

const MOCK_DRAFT_TIMETABLES: TimetableType[] = [
  MOCK_TIMETABLE,
  {
    ...MOCK_TIMETABLE,
    timetableId: 10001,
    tag: '공강 날이 있는 시간표',
    totalPoint: 19,
    courses: [
      {
        category: 'MAJOR_REQUIRED',
        subCategory: null,
        field: null,
        code: 2150451602,
        name: '컴퓨터시스템개론',
        professor: ['이민재'],
        department: '컴퓨터학부',
        division: null,
        time: 0,
        point: 3,
        personeel: 40,
        scheduleRoom: '정보과학관 102',
        target: '전체',
        courseTimes: [
          { week: '월', start: '09:00', end: '10:15', classroom: '정보과학관 102' },
          { week: '수', start: '09:00', end: '10:15', classroom: '정보과학관 102' },
        ],
      },
      {
        category: 'MAJOR_ELECTIVE',
        subCategory: null,
        field: null,
        code: 2150145301,
        name: '운영체제',
        professor: ['최유진'],
        department: '컴퓨터학부',
        division: null,
        time: 0,
        point: 3,
        personeel: 45,
        scheduleRoom: '정보과학관 301',
        target: '전체',
        courseTimes: [
          { week: '화', start: '13:00', end: '14:15', classroom: '정보과학관 301' },
          { week: '목', start: '13:00', end: '14:15', classroom: '정보과학관 301' },
        ],
      },
      {
        category: 'GENERAL_REQUIRED',
        subCategory: null,
        field: null,
        code: 2150102801,
        name: '글쓰기',
        professor: ['한예림'],
        department: '교양학부',
        division: null,
        time: 0,
        point: 2,
        personeel: 70,
        scheduleRoom: '인문관 210',
        target: '전체',
        courseTimes: [{ week: '금', start: '10:00', end: '11:50', classroom: '인문관 210' }],
      },
    ],
  },
  {
    ...MOCK_TIMETABLE,
    timetableId: 10002,
    tag: '점심시간 보장되는 시간표',
    totalPoint: 20,
    courses: [
      {
        category: 'MAJOR_REQUIRED',
        subCategory: null,
        field: null,
        code: 2150451603,
        name: '데이터베이스',
        professor: ['정다은'],
        department: '컴퓨터학부',
        division: null,
        time: 0,
        point: 3,
        personeel: 40,
        scheduleRoom: '정보과학관 201',
        target: '전체',
        courseTimes: [
          { week: '월', start: '14:00', end: '15:15', classroom: '정보과학관 201' },
          { week: '수', start: '14:00', end: '15:15', classroom: '정보과학관 201' },
        ],
      },
      {
        category: 'MAJOR_ELECTIVE',
        subCategory: null,
        field: null,
        code: 2150225101,
        name: '네트워크',
        professor: ['서지훈'],
        department: '컴퓨터학부',
        division: null,
        time: 0,
        point: 3,
        personeel: 45,
        scheduleRoom: '정보과학관 202',
        target: '전체',
        courseTimes: [
          { week: '화', start: '16:00', end: '17:15', classroom: '정보과학관 202' },
          { week: '목', start: '16:00', end: '17:15', classroom: '정보과학관 202' },
        ],
      },
      {
        category: 'GENERAL_ELECTIVE',
        subCategory: null,
        field: null,
        code: 2150102901,
        name: '경제학개론',
        professor: ['윤세진'],
        department: '교양학부',
        division: null,
        time: 0,
        point: 2,
        personeel: 65,
        scheduleRoom: '인문관 120',
        target: '전체',
        courseTimes: [{ week: '금', start: '09:00', end: '10:15', classroom: '인문관 120' }],
      },
    ],
  },
];

const ToolItem = ({ title, description, onClick }: ToolItemProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="flex flex-col">
        <div className="text-[15px] font-semibold">{title}</div>
        {description && <span className="text-neutralSubtle text-[13px]">{description}</span>}
      </div>
      <button
        className="bg-brandPrimary shrink-0 cursor-pointer rounded-md px-4 py-1.5 font-semibold text-white"
        onClick={onClick}
      >
        실행
      </button>
    </div>
  );
};

const TimetableInjectionToolItem = ({ onMutateSuccess }: { onMutateSuccess: () => void }) => {
  const { mutateAsync } = useMutation({
    mutationKey: ['timetables'],
    mutationFn: postTimetable,
  });
  const { studentInfo } = useStudentInfoContext();

  const [timetableData, setTimetableData] = useState(
    JSON.stringify(
      {
        schoolId: 22,
        department: '법학과',
        grade: 2,
        isChapel: true,
        majorRequiredCodes: ['2150545501'],
        majorElectiveCodes: ['2150143401', '2150225101'],
        generalRequiredCodes: ['2150102701'],
        codes: ['2150145301'],
        generalElectivePoint: 6,
        preferredGeneralElectives: ['문화·예술'],
      },
      null,
      2,
    ),
  );

  return (
    <div>
      <ToolItem
        description="하단의 데이터를 조작해서 바로 시간표를 만들어요."
        onClick={async () => {
          const data = JSON.parse(timetableData) as TimetablePayloadType;
          const schoolId = data.schoolId ?? studentInfo.schoolId;
          const department = data.department ?? studentInfo.department;
          const grade = data.grade ?? studentInfo.grade;
          const semester = data.semester ?? studentInfo.semester;
          const subDepartment = data.subDepartment ?? studentInfo.subDepartment;
          const teachTrainingCourse = data.teachTrainingCourse ?? studentInfo.teachTrainingCourse;

          assertNonNullish(schoolId);
          assertNonNullish(department);
          assertNonNullish(grade);

          await mutateAsync({
            semester,
            subDepartment,
            teachTrainingCourse,
            schoolId,
            department,
            grade,
            codes: data.codes,
            generalRequiredCodes: data.generalRequiredCodes,
            majorElectiveCodes: data.majorElectiveCodes,
            majorRequiredCodes: data.majorRequiredCodes,
            generalElectivePoint: data.generalElectivePoint,
            preferredGeneralElectives: data.preferredGeneralElectives,
          });
          onMutateSuccess();
        }}
        title="바로 시간표 만들기"
      />
      <textarea
        className="border-neutralSubtle min-h-[200px] w-full border"
        onChange={(e) => {
          setTimetableData(e.target.value);
        }}
        value={timetableData}
      />
    </div>
  );
};

export const DevtoolsPrimitive = () => {
  const open = useAlertDialog();
  const toast = useToast();
  const { push } = useFlow();
  const { studentInfo, setStudentInfo } = useStudentInfoContext();
  const { setSelectedTimetable, setSelectedGeneralElectives, setSelectedChapelCourse } =
    useSelectedTimetableContext();
  const { mutateAsync: mutateTimetable } = useMutation({
    mutationKey: ['timetables'],
    mutationFn: postTimetable,
  });
  const { mutateAsync: mutateDraftTimetable } = useMutation({
    mutationKey: ['timetables'],
    mutationFn: async (): Promise<TimetableArrayResponseType> => ({
      timestamp: '2026-02-06 10:00:00',
      result: {
        timetables: MOCK_DRAFT_TIMETABLES,
      },
    }),
  });

  const chapelMockPayload: TimetablePayloadType = {
    schoolId: studentInfo.schoolId ?? 22,
    department: studentInfo.department ?? '법학과',
    grade: studentInfo.grade ?? 2,
    semester: studentInfo.semester ?? 1,
    subDepartment: studentInfo.subDepartment,
    teachTrainingCourse: studentInfo.teachTrainingCourse ?? false,
    majorRequiredCodes: [2150545501],
    majorElectiveCodes: [2150143401, 2150225101],
    generalRequiredCodes: [2150102701],
    codes: [2150145301],
    generalElectivePoint: 6,
    preferredGeneralElectives: ['문화·예술'],
  };

  const showDevtools = () => {
    open({
      title: 'Devtools (알파)',
      content: ({ closeAsTrue }) => (
        <>
          <div className="flex w-full flex-col items-center justify-between gap-5">
            <ToolItem
              description="온보딩에서 입력했던 정보를 초기화해요."
              onClick={() => {
                localStorage.removeItem('student-info');
                toast.success('사용자 정보가 초기화되었어요.');
              }}
              title="사용자 정보 초기화"
            />
            <ToolItem
              description="온보딩 페이지로 돌아가요."
              onClick={() => {
                window.location.href = '/';
              }}
              title="처음 화면으로 돌아가기"
            />
            <TimetableInjectionToolItem
              onMutateSuccess={() => {
                push('timetable_result', {
                  timetableId: 0,
                });
                toast.success('시간표 페이지로 이동해요');
                closeAsTrue();
              }}
            />
            <ToolItem
              description="목 데이터로 1차 결과 화면을 열어요."
              onClick={async () => {
                await mutateDraftTimetable();
                push('draft_timetable', {});
                toast.success('1차 결과 화면으로 이동해요');
                closeAsTrue();
              }}
              title="1차 결과 화면 보기"
            />
            <ToolItem
              description="목 데이터로 최종 결과 화면을 열어요."
              onClick={() => {
                setSelectedTimetable(MOCK_TIMETABLE);
                setSelectedGeneralElectives([]);
                setSelectedChapelCourse(null);
                push('timetable_result', { timetableId: MOCK_TIMETABLE_ID });
                toast.success('최종 결과 화면으로 이동해요');
                closeAsTrue();
              }}
              title="최종 결과 화면 보기"
            />
            <ToolItem
              description="목 데이터로 시간표 제안 화면을 열어요."
              onClick={() => {
                push('timetable_suggest', { source: 'mock' });
                toast.success('시간표 제안 화면으로 이동해요');
                closeAsTrue();
              }}
              title="시간표 제안 화면 보기"
            />
            <ToolItem
              description="목 데이터로 채플 선택 화면을 열어요."
              onClick={async () => {
                assertNonNullish(chapelMockPayload.schoolId);
                assertNonNullish(chapelMockPayload.department);
                assertNonNullish(chapelMockPayload.grade);

                await mutateTimetable({
                  semester: chapelMockPayload.semester,
                  subDepartment: chapelMockPayload.subDepartment,
                  teachTrainingCourse: chapelMockPayload.teachTrainingCourse,
                  schoolId: chapelMockPayload.schoolId,
                  department: chapelMockPayload.department,
                  grade: chapelMockPayload.grade,
                  codes: chapelMockPayload.codes,
                  generalRequiredCodes: chapelMockPayload.generalRequiredCodes,
                  majorElectiveCodes: chapelMockPayload.majorElectiveCodes,
                  majorRequiredCodes: chapelMockPayload.majorRequiredCodes,
                  generalElectivePoint: chapelMockPayload.generalElectivePoint,
                  preferredGeneralElectives: chapelMockPayload.preferredGeneralElectives,
                });

                push('chapel_selection', {});
                toast.success('채플 선택 화면으로 이동해요');
                closeAsTrue();
              }}
              title="채플 선택 화면 보기"
            />
            <ToolItem
              description="목 데이터로 교양선택 화면(23학번 이상)을 열어요."
              onClick={() => {
                setStudentInfo({
                  schoolId: 23,
                  department: '법학과',
                  grade: 2,
                  semester: 1,
                  subDepartment: '',
                  teachTrainingCourse: false,
                });
                push('general_elective_selection', {});
                toast.success('교양선택 화면으로 이동해요');
                closeAsTrue();
              }}
              title="교양선택 화면 보기 (23+)"
            />
            <ToolItem
              description="목 데이터로 교양선택 화면(22학번 이하)을 열어요."
              onClick={() => {
                setStudentInfo({
                  schoolId: 22,
                  department: '법학과',
                  grade: 2,
                  semester: 1,
                  subDepartment: '',
                  teachTrainingCourse: false,
                });
                push('general_elective_selection', {});
                toast.success('교양선택 화면으로 이동해요');
                closeAsTrue();
              }}
              title="교양선택 화면 보기 (22-)"
            />
            <ToolItem
              onClick={() => {
                toast.success('성공했어요');
              }}
              title="토스트 실행 > 성공"
            />
            <ToolItem
              onClick={() => {
                toast.error('실패했어요');
              }}
              title="토스트 실행 > 실패"
            />
            <ToolItem
              onClick={() => {
                toast.default('보냈어요');
              }}
              title="토스트 실행 > 기본"
            />
          </div>
        </>
      ),
      closeButton: false,
      closeableWithOutside: true,
    });
  };

  if (STAGE === 'prod') {
    return undefined;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[1000]">
      <div
        className="bg-brandPrimary shadow-devtools cursor-pointer rounded-full p-3"
        onClick={showDevtools}
      >
        <Code className="size-6 text-white" />
      </div>
    </div>
  );
};
