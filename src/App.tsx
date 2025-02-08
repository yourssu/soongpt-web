import { StudentMachineContext } from './machines/studentMachine';
import { Stack } from './stackflow';

const App = () => {
  return (
    <main className="font-pretendard">
      <StudentMachineContext.Provider>
        <Stack />
      </StudentMachineContext.Provider>
    </main>
  );
};

export default App;
