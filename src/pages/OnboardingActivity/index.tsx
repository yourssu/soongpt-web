import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import AppBar from '@/components/AppBar';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import AdmissionYearInput from '@/pages/OnboardingActivity/components/AdmissionYearInput';
import ChapelInput from '@/pages/OnboardingActivity/components/ChapelInput';
import DepartmentInput from '@/pages/OnboardingActivity/components/DepartmentInput';
import GradeInput from '@/pages/OnboardingActivity/components/GradeInput';
import { useFlow } from '@/stackflow';

const OnboardingActivity: ActivityComponentType = () => {
  const state = StudentMachineContext.useSelector((state) => state);
  const actorRef = StudentMachineContext.useActorRef();

  const [progress, setProgress] = useState(0);
  const { push } = useFlow();

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stateProgressMap = {
      학과입력: 25,
      입학년도입력: 50,
      학년입력: 75,
      채플수강여부입력: 100,
    };

    setProgress(stateProgressMap[state.value]);
  }, [state.value]);

  useEffect(() => {
    if (state.matches('채플수강여부입력')) {
      submitButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state]);

  const handleClickButton = () => {
    // actorRef.getPersistedSnapshot()을 통해 현재 state를 가져옴
    const persistedState = actorRef.getPersistedSnapshot();
    // localStorage에 state를 저장
    localStorage.setItem('student', JSON.stringify(persistedState));

    const student = {
      department: state.context.department,
      schoolId: state.context.admissionYear,
      grade: state.context.grade,
      isChapel: state.context.chapel,
    };

    // MixPanel에 사용자 정보 설정
    Mixpanel.setUser(student);
    Mixpanel.registerUser(student);
    Mixpanel.trackUserInformationClick(student);

    push('CourseSelectionActivity', {
      type: 'MAJOR_REQUIRED',
    });
  };

  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <AppBar progress={progress} />
        <div className="mt-6 flex flex-1 flex-col items-center">
          <h2 className="text-[28px] font-semibold">사용자님에 대해 알려주세요!</h2>
          <span className="mt-1 font-light">시간표를 만들기 위한 최소한의 정보가 필요해요.</span>
          <div className="my-8 flex w-full flex-1 flex-col gap-6 px-12">
            {state.matches('채플수강여부입력') && (
              <ChapelInput
                initialValue={state?.context?.chapel}
                onNext={(chapel) =>
                  actorRef.send({
                    type: '채플수강여부입력완료',
                    payload: { chapel },
                  })
                }
              />
            )}

            {(state.matches('학년입력') || state.matches('채플수강여부입력')) && (
              <GradeInput
                initialValue={state?.context?.grade}
                onNext={(grade) =>
                  actorRef.send({
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
                initialValue={state?.context?.admissionYear}
                onNext={(admissionYear) =>
                  actorRef.send({
                    type: '입학년도입력완료',
                    payload: { admissionYear },
                  })
                }
              />
            )}

            <DepartmentInput
              initialValue={state?.context?.department}
              onNext={(department) =>
                actorRef.send({ type: '학과입력완료', payload: { department } })
              }
            />
          </div>

          {state.matches('채플수강여부입력') && (
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="bg-brandPrimary mt-4 w-50 rounded-2xl py-3.5 font-semibold text-white"
              initial={{
                opacity: 0,
                y: 20,
              }}
              onClick={handleClickButton}
              ref={submitButtonRef}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              type="button"
            >
              다 입력했어요
            </motion.button>
          )}
        </div>
      </div>
    </AppScreen>
  );
};

export default OnboardingActivity;
