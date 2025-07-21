import { useEffect } from 'react';

import { ChannelTalk } from '@/bootstrap/channelTalk';
import { Mixpanel } from '@/bootstrap/mixpanel';
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
      <div className="relative mx-auto min-h-dvh w-full max-w-[500px]">
        <Stack />
      </div>
    </main>
  );
};

export default App;
