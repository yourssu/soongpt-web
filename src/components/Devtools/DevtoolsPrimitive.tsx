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
import {
  MOCK_DRAFT_TIMETABLES,
  MOCK_TIMETABLE,
  MOCK_TIMETABLE_ID,
} from '@/mocks/devtools/timetables';
import { TimetableArrayResponseType } from '@/schemas/timetableSchema';
import { assertNonNullish } from '@/utils/assertion';

interface ToolItemProps {
  description?: string;
  onClick: () => void;
  title: string;
}

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
