import type { StackflowReactPlugin } from '@stackflow/react';

import { PostHog } from '@/bootstrap/posthog';
import { activityDescription, type ActivityName } from '@/stackflow/metadata';

export function posthogFunnelPlugin(): StackflowReactPlugin {
  return () => ({
    key: 'posthog-funnel-plugin',

    onPushed({ effect }) {
      const { activity } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      PostHog.trackActivityViewed(activity.name, {
        activity,
        source: 'on_pushed',
      });

      const stepType = activity.params.type;
      if (stepType) {
        PostHog.trackStepViewed(stepType, {
          activity,
          step: activity.steps[activity.steps.length - 1],
          source: 'activity_params',
        });
      }
    },

    onReplaced({ effect }) {
      const { activity } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      PostHog.trackActivityViewed(activity.name, {
        activity,
        source: 'on_replaced',
      });
    },

    onStepPushed({ effect }) {
      const { activity, step } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      const stepType = step.params.type;
      if (!stepType) {
        return;
      }

      PostHog.trackStepViewed(stepType, {
        activity,
        step,
        source: 'step_push',
      });
    },

    onStepReplaced({ effect }) {
      const { activity, step } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      const stepType = step.params.type;
      if (!stepType) {
        return;
      }

      PostHog.trackStepViewed(stepType, {
        activity,
        step,
        source: 'step_replace',
      });
    },

    onPopped({ effect }) {
      const { activity } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      PostHog.trackBackNavigation(activity.name, 'activity_pop', {
        activity,
        source: 'on_popped',
      });
    },

    onStepPopped({ effect }) {
      const { activity } = effect;
      if (!isActivityName(activity.name)) {
        return;
      }

      PostHog.trackBackNavigation(activity.name, 'step_pop', {
        activity,
        step: activity.steps[activity.steps.length - 1],
        source: 'on_step_popped',
      });
    },
  });
}

function isActivityName(name: string): name is ActivityName {
  return name in activityDescription;
}
