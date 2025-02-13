import * as ChannelService from '@channel.io/channel-web-sdk-loader';

ChannelService.loadScript();

export const ChannelTalk = {
  boot: () => {
    ChannelService.boot({
      pluginKey: import.meta.env.VITE_CHANNEL_TALK_PLUGIN_KEY,
    });
  },
};
