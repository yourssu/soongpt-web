import { useFlow } from '@stackflow/react/future';
import { Code } from 'lucide-react';
import { useState } from 'react';
import { usePrevious } from 'react-simplikit';

import { TimetablePayloadType } from '@/api/timetables';
import { useStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { UnfilledStudentInfoType } from '@/components/Providers/StudentInfoProvider/type';
import { STAGE } from '@/config';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { useToast } from '@/hooks/useToast';
import { ActivityParams } from '@/stackflow/metadata';
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

const TimetableInjectionToolItem = ({
  onClick,
}: {
  onClick: (params: ActivityParams<'timetable_selection'>) => void;
}) => {
  const { studentInfo, setStudentInfo } = useStudentInfoContext();
  const originStudentInfo = usePrevious(studentInfo);

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

  const injectStudentInfoForAMoment = (info: UnfilledStudentInfoType) => {
    setStudentInfo(info);
    setTimeout(() => {
      localStorage.setItem('student-info', JSON.stringify(originStudentInfo));
    }, 1000);
  };

  return (
    <div>
      <ToolItem
        description="하단의 데이터를 조작해서 바로 시간표를 만들어요."
        onClick={async () => {
          const data = JSON.parse(timetableData) as TimetablePayloadType;
          const schoolId = data.schoolId ?? studentInfo.schoolId;
          const department = data.department ?? studentInfo.department;
          const grade = data.grade ?? studentInfo.grade;
          const isChapel = data.isChapel ?? studentInfo.isChapel;

          assertNonNullish(schoolId);
          assertNonNullish(department);
          assertNonNullish(grade);
          assertNonNullish(isChapel);

          injectStudentInfoForAMoment({
            schoolId,
            department,
            grade,
            isChapel,
          });

          onClick({
            codes: data.codes,
            generalElectivePoint: data.generalElectivePoint,
            generalRequiredCodes: data.generalRequiredCodes,
            majorElectiveCodes: data.majorElectiveCodes,
            majorRequiredCodes: data.majorRequiredCodes,
            preferredGeneralElectives: data.preferredGeneralElectives,
          });
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
  const { replace } = useFlow();

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
              onClick={(params) => {
                replace('timetable_selection', params, { animate: false });
                toast.success('시간표 페이지로 이동해요');
                closeAsTrue();
              }}
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
