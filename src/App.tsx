import { useEffect } from 'react';

import { ChannelTalk } from '@/bootstrap/channelTalk';
import { Mixpanel } from '@/bootstrap/mixpanel';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { Stack } from '@/stackflow';

const App = () => {
  useEffect(() => {
    // MixPanel 사용자 식별
    Mixpanel.identify();
    // ChannelTalk 채팅 초기화
    ChannelTalk.boot();
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
