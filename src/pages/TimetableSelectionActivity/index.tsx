import { ActivityComponentType } from '@stackflow/react';
import { MutationState, MutationStatus, useMutationState } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import Timetable from '@/components/Timetable';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { TimetableSkeleton } from '@/pages/TimetableSharingActivity/components/TimetableSkeleton';
import { SoongptError } from '@/schemas/errorSchema';
import { TimetableArrayResponse } from '@/schemas/timetableSchema';
import { useFlow } from '@/stackflow';

interface TimetableSelection {
  buttonText: string;
  element: () => ReactElement;
  title: string;
}

type TimetableMutationStatus = 'error400' | 'error500' | Exclude<MutationStatus, 'error'>;

const TimetableSelectionActivity: ActivityComponentType = () => {
  const openShoppingCartDialog = useAlertDialog();
  const timetableMutation = useMutationState<MutationState<TimetableArrayResponse, SoongptError>>({
    filters: { mutationKey: ['timetables'] },
  });

  const latestMutation = timetableMutation[timetableMutation.length - 1];

  const mutationStatus = useMemo(() => {
    const { status, error } = latestMutation;
    if (status === 'error' && error) {
      const errorRange = Math.floor(((latestMutation.error as SoongptError).status ?? 500) / 100);
      return errorRange === 5 ? 'error500' : 'error400';
    }
    return status as Exclude<MutationStatus, 'error'>;
  }, [latestMutation]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { replace, pop } = useFlow();

  const timetableRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTimetableClick = (index: number) => {
    setSelectedIndex(index);
    timetableRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    if (timetableMutation.length === 0) {
      replace('OnboardingActivity', {}, { animate: false });
    }
  }, [timetableMutation, replace]);

  // Mixpanel 이벤트 추적
  useEffect(() => {
    if (latestMutation.status === 'error') {
      if (latestMutation.error) {
        Mixpanel.trackTimetableSelectionError(latestMutation.error);
      }
    }
  }, [latestMutation]);

  const timetableSelection: Record<TimetableMutationStatus, TimetableSelection> = {
    pending: {
      title: '사용자님을 위한\n시간표를 가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: () => (
        <TimetableSkeleton className="pt-4">
          <TimetableSkeleton.Header />
        </TimetableSkeleton>
      ),
    },
    success: {
      title: '사용자님을 위한\n시간표를 가져왔어요!',
      buttonText: '이 시간표가 좋아요',
      element: () => (
        <>
          {latestMutation.data &&
            latestMutation.data.result.timetables.map((timetable, index) => (
              <div
                className="pt-4 first:pt-0"
                data-index={index}
                key={timetable.timetableId}
                onClick={() => handleTimetableClick(index)}
                ref={(element) => {
                  {
                    /* div 요소가 마운트 될 때 실행*/
                  }
                  timetableRefs.current[index] = element;
                }}
              >
                <Timetable
                  className={`${
                    index === selectedIndex ? 'border-brandPrimary' : 'border-neutralPlaceholder'
                  } transition-colors duration-300`}
                  timetable={timetable}
                >
                  <Timetable.Header
                    className={`${
                      index === selectedIndex
                        ? 'bg-brandPrimary text-white'
                        : 'border-neutralPlaceholder border-b-1'
                    } transition-colors duration-300`}
                  />
                </Timetable>
              </div>
            ))}
        </>
      ),
    },
    error400: {
      title: '사용자님을 위한\n시간표를 찾지 못했어요..',
      buttonText: '다시 만들기',
      element: () => (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex size-[170px] items-center justify-center">
            <img alt="Warning" className="object-contain" src="/images/warning.webp" width={170} />
          </div>
        </div>
      ),
    },
    error500: {
      title: '현재 서버에 문제가 있어요.\n잠시 후 다시 시도해주세요.',
      buttonText: '다시 만들기',
      element: () => (
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex size-[170px] items-center justify-center">
            <img alt="Warning" className="object-contain" src="/images/warning.webp" width={170} />
          </div>
        </div>
      ),
    },
    idle: {
      title: '사용자님을 위한\n시간표를 가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: () => <></>,
    },
  };

  const handleShoppingCartButtonClick = () => {
    openShoppingCartDialog({
      title: '예비 수강신청(장바구니)',
      closeButton: true,
      closeableWithOutside: true,
      content: (
        <div className="font-medium">
          <div>[장바구니 이용 기간]</div>
          <div>
            <span className="text-brandSecondary">7/30(수) 00:00</span> ~ 9/5(금) 09:00
          </div>
          <br />
          <div>[장바구니 이용 제한 기간]</div>
          <div>
            <span className="text-brandSecondary">8/4(월) ~ 8/8(금) 09:00 ~ 16:00은 이용 불가</span>
          </div>
          <div>(수강신청 변경 기간도 이용 불가)</div>
          <br />
          <div>
            - <span className="text-brandSecondary">최대 15과목</span>까지 담기 가능
          </div>
          <br />
          <div>
            - 장바구니에 담아놓아도{' '}
            <span className="text-brandSecondary">자동 수강신청 되지 않음</span>
          </div>
        </div>
      ),
    });
  };

  if (!latestMutation) {
    return null;
  }

  return (
    <ActivityLayout>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="flex w-full flex-1 flex-col items-center"
        initial={{ y: 20, opacity: 0 }}
        key={latestMutation.status}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <ActivityLayout.ScrollArea>
          <ActivityLayout.Body>
            <ProgressAppBar progress={100} />
            <div className="flex flex-col items-center gap-2">
              <h2 className="mt-6 text-center text-[28px]/[normal] font-semibold whitespace-pre-wrap">
                {timetableSelection[mutationStatus].title}
              </h2>
              <span className="font-light">원하는 시간표를 장바구니에 담아보세요.</span>
              <button
                className="text-brandPrimary text-xs underline"
                onClick={handleShoppingCartButtonClick}
              >
                예비 수강신청(장바구니) 안내
              </button>
            </div>
            <div className="mt-7.5 flex w-full flex-1 flex-col pb-4">
              {timetableSelection[mutationStatus].element()}
            </div>
            {/* Todo: 에러일때만 버튼 보이도록 컴포넌트 구조 및 로직 자체를 변경 */}
            {mutationStatus === 'error400' ||
              (mutationStatus === 'error500' && (
                <button
                  className="bg-brandPrimary sticky bottom-6 w-full rounded-2xl py-3.5 font-semibold text-white shadow-sm"
                  onClick={() => pop(2)}
                  type="button"
                >
                  {timetableSelection[mutationStatus].buttonText}
                </button>
              ))}
          </ActivityLayout.Body>
        </ActivityLayout.ScrollArea>
      </motion.div>
    </ActivityLayout>
  );
};

export default TimetableSelectionActivity;
