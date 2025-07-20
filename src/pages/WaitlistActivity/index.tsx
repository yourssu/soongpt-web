import * as Toast from '@radix-ui/react-toast';
import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { useMutation } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';

import api from '@/api/client';
import Wrench from '@/assets/wrench.svg';

export const WaitlistActivity: ActivityComponentType = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: '',
    description: '',
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (content: string) => {
      return api.post('contacts', {
        json: {
          content,
        },
      });
    },
  });

  const onClickWaitlist = async () => {
    try {
      await mutateAsync(emailOrPhone);
      setToastMessage({
        title: '출시 알림 등록이 완료되었어요!',
        description: '서비스가 출시되면 가장 먼저 안내드릴게요.',
      });
      setOpenToast(true);
      setEmailOrPhone('');
      setIsTermsAgreed(false);
    } catch {
      setToastMessage({
        title: '출시 알림 등록에 실패했어요.',
        description: '잠시후에 다시 시도해주세요.',
      });
      setOpenToast(true);
    }
  };

  return (
    <AppScreen>
      <Toast.Provider duration={3000} swipeDirection="right">
        <div className="flex min-h-dvh items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <img alt="wrench" src={Wrench} width={107} />

            <div className="flex flex-col items-center gap-2">
              <div className="text-brandPrimary font-medium">클릭 몇 번으로 최적의 시간표 완성</div>
              <div className="text-[28px] font-semibold">숭피티가 준비 중이에요!</div>
              <div className="font-light">서비스가 시작되면 가장 먼저 안내드릴게요.</div>
            </div>

            <div className="flex w-full flex-col items-center gap-2">
              <input
                className="bg-bg-layerDefault text-brandPrimary focus-visible:outline-borderRing w-full rounded-xl px-4 py-3 text-lg font-semibold"
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="이메일 또는 전화번호"
                type="text"
                value={emailOrPhone}
              />
              <button
                className="bg-bg-layerDefault focus-visible:outline-borderRing text-brandPrimary flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-lg font-medium"
                onClick={() => setIsTermsAgreed((prev) => !prev)}
                type="button"
              >
                개인정보 수집·이용 동의
                <CircleCheck
                  className={clsx(
                    'size-6',
                    isTermsAgreed ? 'text-brandPrimary' : 'text-neutralDisabled',
                  )}
                />
              </button>
              <a
                className="text-neutralPlaceholder cursor-pointer text-sm underline"
                href="https://yourssu.notion.site/2366915d69788192862bdd49f388ee16"
                rel="noreferrer noopener"
                target="_blank"
              >
                개인정보 수집·이용 동의서
              </a>
            </div>

            <button
              className="bg-brandPrimary disabled:bg-bg-buttonDisabled disabled:text-text-buttonDisabled h-[52px] w-full cursor-pointer rounded-2xl text-center font-semibold text-white disabled:cursor-not-allowed"
              disabled={!isTermsAgreed || !emailOrPhone.trim() || isPending}
              onClick={onClickWaitlist}
            >
              출시 알림 받기
            </button>
          </div>
        </div>

        <Toast.Root
          className="rounded-md border border-gray-200 bg-white p-4 shadow-lg"
          onOpenChange={setOpenToast}
          open={openToast}
        >
          <Toast.Title className="mb-1 text-center font-medium text-gray-900">
            {toastMessage.title}
          </Toast.Title>
          <Toast.Description className="text-sm text-gray-500">
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed top-0 left-1/2 z-50 m-0 flex w-full -translate-x-1/2 justify-center p-6 outline-none" />
      </Toast.Provider>
    </AppScreen>
  );
};
