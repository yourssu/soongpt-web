import { overlay } from 'overlay-kit';
import React from 'react';

import { Dialog } from '@/components/Dialog';

interface UseAlertDialogOpenProps {
  closeableWithOutside?: boolean;
  closeButton?: boolean;
  content: React.ReactNode;
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

      return (
        <Dialog closeableWithOutside={closeableWithOutside} onClose={closeAsFalse} open={isOpen}>
          <Dialog.Header onClickCloseButton={closeButton ? closeAsFalse : undefined}>
            <Dialog.Title>{title}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Content>{content}</Dialog.Content>
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
