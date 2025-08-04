import { useEffect, useRef } from 'react';

import { stackflowTransitionDuration } from '@/stackflow/stackflow.config';

/* 
  스택플로우에서 트랜지션 도중에 input 포커싱(autofocus)이 발생하면 트랜지션이 뭉게지는 이슈가 있어요.
  이를 방지하기 위해 트랜지션 이후에 programmatic focus를 주는 로직이에요.
*/
export const useStackflowInputAutoFocusEffect = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      const timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, stackflowTransitionDuration);
      return () => clearTimeout(timeout);
    }
  }, []);

  return inputRef;
};
