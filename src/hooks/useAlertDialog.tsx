import { overlay } from 'overlay-kit';
import React from 'react';

import { Dialog } from '@/components/Dialog';

type OpenPayload = {
  closeAsFalse: () => void;
  closeAsTrue: () => void;
};

interface UseAlertDialogOpenProps {
  closeableWithOutside?: boolean;
  closeButton?: boolean;
  content: ((payload: OpenPayload) => React.ReactNode) | React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  title: string;
}

export const useAlertDialog = () => {
  const open = async ({
    closeButton,
    title,
    content,
    closeableWithOutside,
    primaryButtonText,
    secondaryButtonText,
  }: UseAlertDialogOpenProps) =>
    await overlay.openAsync<boolean>(({ isOpen, close }) => {
      const closeAsTrue = () => close(true);
      const closeAsFalse = () => close(false);

      const renderAnyButton = !!primaryButtonText || !!secondaryButtonText;
      const renderedContent =
        typeof content === 'function' ? content({ closeAsTrue, closeAsFalse }) : content;

      return (
        <Dialog closeableWithOutside={closeableWithOutside} onClose={closeAsFalse} open={isOpen}>
          <Dialog.Header onClickCloseButton={closeButton ? closeAsFalse : undefined}>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Content>{renderedContent}</Dialog.Content>
          {renderAnyButton && (
            <Dialog.ButtonGroup>
              {!!secondaryButtonText && (
                <Dialog.Button onClick={closeAsFalse} variant="secondary">
                  {secondaryButtonText}
                </Dialog.Button>
              )}
              {!!primaryButtonText && (
                <Dialog.Button onClick={closeAsTrue} variant="primary">
                  {primaryButtonText}
                </Dialog.Button>
              )}
            </Dialog.ButtonGroup>
          )}
        </Dialog>
      );
    });

  return open;
};
