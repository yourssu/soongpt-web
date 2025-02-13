import { useEffect } from 'react';
import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';
import { Mixpanel } from './utils/mixpanel';

const App = () => {
  useEffect(() => {
    // MixPanel에 사용자 식별
    Mixpanel.identify();
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
