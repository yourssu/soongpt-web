import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { tv } from 'tailwind-variants';

import { IcMonoClose } from '@/components/Icons/IcMonoClose';
import { cn } from '@/utils/dom';

interface DialogProps {
  closeableWithOutside?: boolean;
  contentProps?: DialogPrimitive.DialogContentProps;
  onClose: () => void;
  open: boolean;
}

const Header = ({
  children,
  onClickCloseButton,
}: React.PropsWithChildren<{ onClickCloseButton?: () => void }>) => {
  return (
    <div className="flex w-full">
      <div className="w-full px-5 pt-5">{children}</div>
      {onClickCloseButton && (
        <div className="pt-5 pr-3.5">
          <button
            className="hover:bg-grey200 active:bg-grey200 focus-visible:bg-grey200 ease-ease inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors duration-200"
            onClick={onClickCloseButton}
          >
            <IcMonoClose className="text-neutral" size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const Title = ({ children }: React.PropsWithChildren<unknown>) => {
  return <div className="text-xl font-semibold">{children}</div>;
};

const Content = ({ children, className }: React.PropsWithChildren<{ className?: string }>) => {
  return <div className={cn('flex flex-col px-5 py-3 text-sm', className)}>{children}</div>;
};

const ButtonGroup = ({ children }: React.PropsWithChildren<unknown>) => {
  return <div className="flex w-full justify-end gap-1 px-5 pb-3">{children}</div>;
};

const buttonVariant = tv({
  base: 'h-[40px] w-[100px] cursor-pointer rounded-lg font-medium',
  variants: {
    variant: {
      primary: 'bg-brandPrimary text-white',
      secondary: 'bg-bg-brandLayerDefault text-brandSecondary',
    },
  },
});

const Button = ({
  className,
  children,
  variant,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: 'primary' | 'secondary' }) => {
  return (
    <button className={cn(buttonVariant({ variant }), className)} {...props}>
      {children}
    </button>
  );
};

export const Dialog = ({
  onClose,
  open,
  closeableWithOutside,
  children,
  contentProps = {},
}: React.PropsWithChildren<DialogProps>) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current =
        document.body.querySelector<HTMLElement>('[data-app-container]') ?? document.body;
    }
  }, []);

  const onCloseWithOutside = (e: Event) => {
    if (!closeableWithOutside) {
      e.preventDefault();
    }
  };

  return (
    <DialogPrimitive.Root onOpenChange={(v) => !v && onClose()} open={open}>
      <AnimatePresence>
        {open && (
          // forceMount: 이게 있어야 exit 애니메이션이 제대로 작동해요.
          <DialogPrimitive.Portal container={containerRef.current} forceMount>
            <DialogPrimitive.Overlay className="absolute inset-0 z-50">
              <motion.div
                animate="animate"
                className="bg-bg-modalLayerOpacity size-full"
                exit="initial"
                initial="initial"
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1], // timing-function: ease
                }}
                variants={{
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                }}
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              {...contentProps}
              className="absolute top-1/2 left-1/2 z-50 flex size-full -translate-1/2 items-center justify-center overflow-y-auto p-4"
              onInteractOutside={onCloseWithOutside}
              onPointerDownOutside={onCloseWithOutside}
            >
              <motion.div
                animate="animate"
                className="shadow-dialog bg-background max-h-full w-full max-w-[343px] overflow-y-auto rounded-3xl pb-2 will-change-transform"
                exit="initial"
                initial="initial"
                transition={{
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1], // timing-function: ease
                }}
                variants={{
                  initial: { opacity: 0, scale: 0.7 },
                  animate: { opacity: 1, scale: 1 },
                }}
              >
                <VisuallyHidden>
                  <DialogPrimitive.Title />
                  <DialogPrimitive.Description />
                  <DialogPrimitive.Close />
                </VisuallyHidden>
                {children}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};

Dialog.Header = Header;
Dialog.Content = Content;
Dialog.Title = Title;
Dialog.ButtonGroup = ButtonGroup;
Dialog.Button = Button;
