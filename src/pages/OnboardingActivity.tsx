import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import { useMachine } from '@xstate/react';
import AdmissionYearInput from '../components/AdmissionYearInput';
import AppBar from '../components/AppBar';
import DepartmentInput from '../components/DepartmentInput';
import GradeInput from '../components/GradeInput';
import { default as studentMachine } from '../machines/studentMachine';

const OnboardingActivity: ActivityComponentType = () => {
  const [state, send] = useMachine(studentMachine);

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-[28px] font-semibold">사용자님에 대해 알려주세요!</h2>
          <span className="mt-2 font-light">시간표를 만들기 위한 최소한의 정보가 필요해요.</span>
          <div className="mt-15 flex w-full flex-col gap-6 px-12">
            {(state.matches('학년입력') || state.matches('채플수강여부입력')) && (
              <GradeInput
                onNext={(grade) =>
                  send({
                    type: '학년입력완료',
                    payload: { grade },
                  })
                }
              />
            )}

            {(state.matches('입학년도입력') ||
              state.matches('학년입력') ||
              state.matches('채플수강여부입력')) && (
              <AdmissionYearInput
                onNext={(admissionYear) =>
                  send({
                    type: '입학년도입력완료',
                    payload: { admissionYear },
                  })
                }
              />
            )}

            <DepartmentInput
              onNext={(department) => send({ type: '학과입력완료', payload: { department } })}
            />
          </div>
        </div>
      </div>
    </AppScreen>
  );
};

export default OnboardingActivity;
