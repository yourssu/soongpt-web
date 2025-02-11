import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';
import { Suspense } from 'react';

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
