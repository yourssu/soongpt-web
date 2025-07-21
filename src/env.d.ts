interface ImportMetaEnv {
  readonly VITE_CHANNEL_TALK_PLUGIN_KEY: string;
  readonly VITE_MIXPANEL_TOKEN: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_STAGE: 'alpha' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
