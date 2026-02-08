interface ImportMetaEnv {
  readonly VITE_API_MOCKING?: string;
  readonly VITE_CHANNEL_TALK_PLUGIN_KEY: string;
  readonly VITE_MIXPANEL_TOKEN: string;
  readonly VITE_PUBLIC_POSTHOG_HOST: string;
  readonly VITE_PUBLIC_POSTHOG_KEY: string;
  readonly VITE_SENTRY_AUTH_TOKEN: string;
  readonly VITE_SENTRY_DSN: string;
  readonly VITE_SSO_CALLBACK_URL?: string;
  readonly VITE_STAGE: 'alpha' | 'prod';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
