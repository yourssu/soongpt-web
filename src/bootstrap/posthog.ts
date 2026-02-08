import { nanoid } from 'nanoid';
import posthog, { type PostHogConfig } from 'posthog-js';

import type { ActivityName } from '@/stackflow/metadata';
import type { StudentType } from '@/types/student';

const POSTHOG_API_KEY = import.meta.env.VITE_PUBLIC_POSTHOG_KEY;

const POSTHOG_OPTIONS: Partial<PostHogConfig> = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: '2025-05-24',
  capture_exceptions: true,
  debug: import.meta.env.MODE === 'development',
};

posthog.init(POSTHOG_API_KEY, POSTHOG_OPTIONS);

export const PostHogClient = posthog;

type EventProperties = Record<string, unknown>;

const BASE_PROPERTIES = {
  env: import.meta.env.MODE,
  funnel_name: 'course_to_timetable_2026_1',
  funnel_version: 1,
  surface: 'web',
} as const;

const sanitizeProperties = (properties: EventProperties = {}) => {
  return Object.fromEntries(
    Object.entries({
      ...BASE_PROPERTIES,
      ...properties,
    }).filter(([, value]) => value !== undefined),
  );
};

const capture = (event: string, properties: EventProperties = {}) => {
  try {
    posthog.capture(event, sanitizeProperties(properties));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('[PostHog] capture failed', { error, event });
    }
  }
};

export const PostHog = {
  capture,

  setUser: (student: StudentType) => {
    posthog.identify(
      `${student.department}-${student.schoolId}-${student.grade}학년-${nanoid()}`,
      student,
    );
  },

  trackActivityViewed: (activity: ActivityName, properties: EventProperties = {}) => {
    capture('funnel_activity_viewed', {
      activity,
      ...properties,
    });
  },

  trackActivityCtaClicked: (
    activity: ActivityName,
    cta: string,
    properties: EventProperties = {},
  ) => {
    capture('funnel_activity_cta_clicked', {
      activity,
      cta,
      ...properties,
    });
  },

  trackBackNavigation: (
    activity: ActivityName,
    backType: 'activity_pop' | 'step_pop',
    properties: EventProperties = {},
  ) => {
    capture('funnel_back_navigation', {
      activity,
      backType,
      ...properties,
    });
  },

  trackStepViewed: (step: string, properties: EventProperties = {}) => {
    capture('funnel_step_viewed', {
      step,
      ...properties,
    });
  },

  trackStepNextClicked: (step: string, properties: EventProperties = {}) => {
    capture('funnel_step_next_clicked', {
      step,
      ...properties,
    });
  },

  trackFieldChanged: (field: string, properties: EventProperties = {}) => {
    capture('funnel_field_changed', {
      field,
      ...properties,
    });
  },

  trackSearchUpdated: (scope: string, properties: EventProperties = {}) => {
    capture('funnel_search_updated', {
      scope,
      ...properties,
    });
  },

  trackCourseToggled: (
    scope: string,
    properties: {
      category?: string;
      courseCode: number;
      credit?: number;
      selected: boolean;
      source?: string;
    },
  ) => {
    capture('funnel_course_toggled', {
      scope,
      ...properties,
    });
  },

  trackModalDecision: (
    scope: string,
    decision: 'cancel' | 'confirm',
    properties: EventProperties = {},
  ) => {
    capture('funnel_modal_decision', {
      scope,
      decision,
      ...properties,
    });
  },

  trackFunnelStageCompleted: (
    stage:
      | 'chapel'
      | 'course_selection'
      | 'general_elective'
      | 'onboarding'
      | 'timetable_finalized'
      | 'timetable_recommended',
    properties: EventProperties = {},
  ) => {
    capture('funnel_stage_completed', {
      stage,
      ...properties,
    });
  },
};
