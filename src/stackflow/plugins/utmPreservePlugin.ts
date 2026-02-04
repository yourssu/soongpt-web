import type { StackflowReactPlugin } from '@stackflow/react';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

/**
 * UTM 파라미터를 activity/step 이동 시 유지하는 플러그인
 */
export function utmPreservePlugin(): StackflowReactPlugin {
  // historySyncPlugin의 overrideInitialEvents가 실행되면 URL이 변경되어 UTM이 사라지므로 미리 Stackflow 초기화 시점에 UTM 저장
  const initialUtmParams = getUtmParamsFromUrl();

  const withUtm = (params: Record<string, string | undefined>) => ({
    ...initialUtmParams,
    ...params,
  });

  return () => ({
    key: 'utm-preserve-plugin',

    /**
     * 최초 페이지 진입 시 historySyncPlugin가 생성하는 initialEvents에 UTM을 params에 주입하여 UR에 UTM이 유지되도록 함
     */
    overrideInitialEvents({ initialEvents }) {
      if (Object.keys(initialUtmParams).length === 0) {
        return initialEvents;
      }

      return initialEvents.map((event) => {
        if (event.name === 'Pushed') {
          return {
            ...event,
            activityParams: withUtm(event.activityParams),
          };
        }
        if (event.name === 'StepPushed') {
          return {
            ...event,
            stepParams: withUtm(event.stepParams),
          };
        }
        return event;
      });
    },

    /**
     * 네비게이션 액션(Push, Replace, StepPush, StepReplace) 실행 전에 UTM을 params에 주입하여 URL에 UTM이 유지되도록 함
     */
    onBeforePush({ actionParams, actions: { overrideActionParams } }) {
      overrideActionParams({
        ...actionParams,
        activityParams: withUtm(actionParams.activityParams),
      });
    },

    onBeforeReplace({ actionParams, actions: { overrideActionParams } }) {
      overrideActionParams({
        ...actionParams,
        activityParams: withUtm(actionParams.activityParams),
      });
    },

    onBeforeStepPush({ actionParams, actions: { overrideActionParams } }) {
      overrideActionParams({
        ...actionParams,
        stepParams: withUtm(actionParams.stepParams),
      });
    },

    onBeforeStepReplace({ actionParams, actions: { overrideActionParams } }) {
      overrideActionParams({
        ...actionParams,
        stepParams: withUtm(actionParams.stepParams),
      });
    },
  });
}

function getUtmParamsFromUrl(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {};
  }

  const searchParams = new URLSearchParams(window.location.search);
  const utmParams: Record<string, string> = {};

  UTM_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}
