import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import { useMachine } from '@xstate/react';
import AppBar from '../components/AppBar';
import DepartmentInput from '../components/DepartmentInput';
import studentMachine from '../machines/studentMachine';

const OnboardingActivity: ActivityComponentType = () => {
  const [state, send] = useMachine(studentMachine);

  console.log(state);

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-[28px] font-semibold">사용자님에 대해 알려주세요!</h2>
          <span className="mt-2 font-light">시간표를 만들기 위한 최소한의 정보가 필요해요.</span>
          <div className="mt-15 w-full px-12">
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
