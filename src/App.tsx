import { Suspense } from 'react';
import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';

const App = () => {
  return (
    <main className="font-pretendard">
      <StudentMachineContext.Provider>
        <Suspense>
          <Stack />
        </Suspense>
      </StudentMachineContext.Provider>
    </main>
  );
};

export default App;
