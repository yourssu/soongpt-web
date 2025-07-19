import { useEffect } from 'react';

import { StudentMachineContext } from '@/context/StudentMachineContext';
import { Stack } from '@/stackflow';
import { ChannelTalk } from '@/utils/channelTalk';
import { Mixpanel } from '@/utils/mixpanel';

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
