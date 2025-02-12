import { useEffect } from 'react';
import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';
import { Mixpanel } from './utils/mixpanel';

const App = () => {
  // Identify the user
  useEffect(() => {
    const userId = crypto.randomUUID();
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
