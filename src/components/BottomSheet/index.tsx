import { animate, motion, type PanInfo, useDragControls, useMotionValue } from 'motion/react';
import {
  type PointerEvent,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type WheelEventHandler,
} from 'react';

import { cn } from '@/utils/dom';

export type BottomSheetState = 'open' | 'peek';

export interface BottomSheetTransition {
  damping?: number;
  duration?: number;
  ease?: string;
  stiffness?: number;
  type?: 'spring' | 'tween';
}

export interface BottomSheetNextStateParams {
  currentY: number;
  info: PanInfo;
  maxOffset: number;
  state: BottomSheetState;
}

export interface BottomSheetProps {
  className?: string;
  containerClassName?: string;
  dragElastic?: number;
  dragHandleOnly?: boolean;
  getNextState?: (params: BottomSheetNextStateParams) => BottomSheetState;
  handleWrapperClassName?: string;
  onHandleClick?: () => void;
  onStateChange: (state: BottomSheetState) => void;
  onWheel?: WheelEventHandler<HTMLDivElement>;
  openOnClick?: boolean;
  peekHeight?: number;
  renderHandle?: (state: BottomSheetState) => ReactNode;
  state: BottomSheetState;
}

const defaultTransition = {
  type: 'spring',
  stiffness: 520,
  damping: 40,
} satisfies BottomSheetTransition;

const defaultNextState = ({ maxOffset, currentY, state }: BottomSheetNextStateParams) => {
  if (state === 'open') {
    return currentY > maxOffset * 0.1 ? 'peek' : 'open';
  }
  return currentY < maxOffset * 0.9 ? 'open' : 'peek';
};

const defaultContainerClassName = 'fixed inset-x-0 bottom-0 z-[200] flex justify-center';
const defaultSheetClassName =
  'bg-background w-full max-w-[500px] rounded-t-[24px] shadow-[inset_0px_1px_2px_0px_rgba(0,0,0,0.08)] flex max-h-[calc(100dvh-24px)] flex-col overflow-hidden px-6 pt-4 pb-6';
const defaultHandleWrapperClassName = 'w-full pt-4 pb-2';

const Header = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('flex flex-col gap-4', className)}>{children}</div>;
};

const Body = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto', className)}>
      {children}
    </div>
  );
};

const Footer = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('mt-auto', className)}>{children}</div>;
};

export const BottomSheet = ({
  children,
  className,
  containerClassName,
  dragElastic = 0.08,
  dragHandleOnly = false,
  getNextState = defaultNextState,
  handleWrapperClassName,
  onHandleClick,
  onStateChange,
  onWheel,
  openOnClick = true,
  peekHeight = 120,
  renderHandle,
  state,
}: PropsWithChildren<BottomSheetProps>) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState(0);
  const y = useMotionValue(0);
  const isInitialized = useRef(false);
  const dragControls = useDragControls();

  useLayoutEffect(() => {
    if (!sheetRef.current) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      setSheetHeight(entry.contentRect.height);
    });

    observer.observe(sheetRef.current);
    return () => observer.disconnect();
  }, []);

  const maxOffset = Math.max(sheetHeight - peekHeight, 0);

  useEffect(() => {
    if (!isInitialized.current) {
      return;
    }

    const target = state === 'open' ? 0 : maxOffset;
    const controls = animate(y, target, defaultTransition);
    return controls.stop;
  }, [maxOffset, state, y]);

  useEffect(() => {
    if (maxOffset === 0 || isInitialized.current) {
      return;
    }

    y.set(state === 'open' ? 0 : maxOffset);
    isInitialized.current = true;
  }, [maxOffset, state, y]);

  const handleClick = () => {
    if (openOnClick && state === 'peek') {
      onStateChange('open');
    }
  };

  const handleDragEnd = (info: PanInfo) => {
    const nextState = getNextState({ state, maxOffset, currentY: y.get(), info });
    onStateChange(nextState);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragHandleOnly) {
      return;
    }
    dragControls.start(event);
  };

  const resolvedHandle = renderHandle ? (
    renderHandle(state)
  ) : (
    <div className="bg-neutralHint h-1 w-8 rounded-full" />
  );

  return (
    <div className={cn(defaultContainerClassName, containerClassName)}>
      <motion.div
        className={cn(defaultSheetClassName, className)}
        drag="y"
        dragConstraints={{ top: 0, bottom: maxOffset }}
        dragControls={dragControls}
        dragElastic={dragElastic}
        dragListener={!dragHandleOnly}
        dragMomentum={false}
        onClick={handleClick}
        onDragEnd={(_, info) => handleDragEnd(info)}
        onWheel={onWheel}
        ref={sheetRef}
        style={{ y }}
      >
        <div
          className={cn(
            'flex items-center justify-center',
            defaultHandleWrapperClassName,
            handleWrapperClassName,
          )}
          onClick={onHandleClick}
          onPointerDown={handlePointerDown}
          role="button"
        >
          {resolvedHandle}
        </div>
        {children}
      </motion.div>
    </div>
  );
};

BottomSheet.Header = Header;
BottomSheet.Body = Body;
BottomSheet.Footer = Footer;
