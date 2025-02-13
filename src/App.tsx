import { useEffect } from 'react';
import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';
import { Mixpanel } from './utils/mixpanel';

const MIXPANEL_USER_ID_KEY = 'mixpanel_user_id';

const App = () => {
  useEffect(() => {
    // localStorage에서 기존 userId 확인
    let userId = localStorage.getItem(MIXPANEL_USER_ID_KEY);

    // userId가 없으면 새로 생성하고 저장
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem(MIXPANEL_USER_ID_KEY, userId);
    }

    // MixPanel에 사용자 식별
    Mixpanel.identify(userId);
  }, []);

  return (
    <main className="font-pretendard">
      <StudentMachineContext.Provider>
        <Stack />
      </StudentMachineContext.Provider>
    </main>
  );
};

export default App;
