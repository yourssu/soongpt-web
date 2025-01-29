import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import { useMachine } from '@xstate/react';
import { useEffect, useState } from 'react';
import AdmissionYearInput from '../components/AdmissionYearInput';
import AppBar from '../components/AppBar';
import ChapelInput from '../components/ChapelInput';
import DepartmentInput from '../components/DepartmentInput';
import GradeInput from '../components/GradeInput';
import { default as studentMachine } from '../machines/studentMachine';
import { useFlow } from '../stackflow.ts';

const OnboardingActivity: ActivityComponentType = () => {
  const { push } = useFlow();

  const [state, send] = useMachine(studentMachine);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stateProgressMap = {
      학과입력: 25,
      입학년도입력: 50,
      학년입력: 75,
      채플수강여부입력: 100,
    };

    setProgress(stateProgressMap[state.value]);
  }, [state.value]);

  const handleClickButton = () => {
    push('CourseSelectionActivity', {});
  };

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={progress} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-[28px] font-semibold">사용자님에 대해 알려주세요!</h2>
          <span className="mt-1 font-light">시간표를 만들기 위한 최소한의 정보가 필요해요.</span>
          <div className="mt-12 flex w-full flex-col gap-6 px-12">
            {state.matches('채플수강여부입력') && (
              <ChapelInput
                onNext={(chapel) =>
                  send({
                    type: '채플수강여부입력완료',
                    payload: { chapel },
                  })
                }
              />
            )}

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

          {state.matches('채플수강여부입력') && (
            <button
              type="button"
              className="bg-progress-bar mt-14 w-50 rounded-2xl py-3.5 font-semibold text-white"
              onClick={handleClickButton}
            >
              다 입력했어요
            </button>
          )}
        </div>
      </div>
    </AppScreen>
  );
};

export default OnboardingActivity;
