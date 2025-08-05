import { receive, send } from '@stackflow/compat-await-push';
import { InferActivityParams } from '@stackflow/config';
import { useActivity, useFlow } from '@stackflow/react/future';
import { useCallback, useEffect, useRef } from 'react';

import { ActivityName } from '@/stackflow/metadata';
import { ActivityNameWithPayload } from '@/stackflow/payload';

type Result<T> =
  | {
      data: T;
      success: true;
    }
  | {
      success: false;
    };

export const useReceive = () => {
  const { push } = useFlow();

  const pushAndReceive = <
    TName extends ActivityName,
    TPayload = TName extends keyof ActivityNameWithPayload ? ActivityNameWithPayload[TName] : never,
    TResult = Result<TPayload>,
  >(
    activityName: TName,
    params: InferActivityParams<TName>,
  ): Promise<TResult> => {
    return receive<TResult>(push(activityName, params));
  };

  return { pushAndReceive };
};

export const useSend = <
  TName extends ActivityName,
  TPayload = TName extends keyof ActivityNameWithPayload ? ActivityNameWithPayload[TName] : never,
  TResult = Result<TPayload>,
>() => {
  const isAnsweredRef = useRef(false);
  const { pop } = useFlow();
  const { id, isTop, transitionState } = useActivity();

  const answer = useCallback(
    (payload: TPayload | undefined) => {
      if (!isAnsweredRef.current) {
        isAnsweredRef.current = true;
        const result = payload ? { data: payload, success: true } : { success: false };
        send({
          activityId: id,
          data: result as TResult,
        });
      }
    },
    [id],
  );

  const popAndSend = (payload: TPayload, options: { animate?: boolean } = { animate: true }) => {
    pop(options);
    answer(payload);
  };

  /* 
    send를 하지 않고 액티비티를 나가는 경우에는 실패로 처리해요.
  */
  useEffect(() => {
    if (isTop && transitionState === 'exit-active') {
      answer(undefined);
    }
  }, [isTop, transitionState, answer]);

  return { popAndSend };
};
