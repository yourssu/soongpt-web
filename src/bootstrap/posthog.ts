import posthog, { type PostHogConfig } from 'posthog-js';

const POSTHOG_API_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

const POSTHOG_OPTIONS: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  capture_exceptions: true,
  debug: import.meta.env.MODE === 'development',
};

posthog.init(POSTHOG_API_KEY, POSTHOG_OPTIONS);

export const PostHogClient = posthog;

export const PostHog = {};
