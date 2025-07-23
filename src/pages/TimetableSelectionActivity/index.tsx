import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';
import { MutationState, MutationStatus, useMutationState } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { ReactElement, useEffect, useRef, useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import Timetable from '@/components/Timetable';
import { TimetableSkeleton } from '@/pages/TimetableSharingActivity/components/TimetableSkeleton';
import { SoongptError } from '@/schemas/errorSchema';
import { TimetableArrayResponse } from '@/schemas/timetableSchema';
import { useFlow } from '@/stackflow';

interface TimetableSelection {
  buttonText: string;
  element: () => ReactElement;
  title: string;
}

const TimetableSelectionActivity: ActivityComponentType = () => {
  const timetableMutation = useMutationState<MutationState<TimetableArrayResponse, SoongptError>>({
    filters: { mutationKey: ['timetables'] },
  });

  const latestMutation = timetableMutation[timetableMutation.length - 1];

  const [selectedIndex, setSelectedIndex] = useState(0);

  const { push, replace, pop } = useFlow();

  const timetableRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleTimetableClick = (index: number) => {
    setSelectedIndex(index);
    timetableRefs.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  const handleNextClick = () => {
    if (latestMutation.status === 'error') {
      pop(2);
    }

    if (latestMutation.data) {
      const selectedTimetable = latestMutation.data.result.timetables[selectedIndex];
      const unSelectedTimetable = latestMutation.data.result.timetables.filter(
        (timetable) => timetable.timetableId !== selectedTimetable.timetableId,
      );

      // Mixpanel 이벤트 추적
      Mixpanel.trackTimetableSelectionClick(selectedTimetable, unSelectedTimetable);

      push('TimetableSharingActivity', {
        timetableId: selectedTimetable.timetableId,
      });
    }
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

  const timetableSelection: Record<MutationStatus, TimetableSelection> = {
    pending: {
      title: '가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: () => (
        <TimetableSkeleton className="pt-4">
          <TimetableSkeleton.Header />
        </TimetableSkeleton>
      ),
    },
    success: {
      title: '가져왔어요!',
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
    error: {
      title: '찾지 못했어요..',
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
      title: '가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: () => <></>,
    },
  };

  if (!latestMutation) {
    return null;
  }

  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <ProgressAppBar progress={100} />
        <motion.div
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 flex flex-1 flex-col items-center"
          initial={{ y: 20, opacity: 0 }}
          key={latestMutation.status}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <h2 className="text-center text-[28px] font-semibold whitespace-pre-wrap">
            {`사용자님을 위한\n시간표를 ${timetableSelection[latestMutation.status].title}`}
          </h2>
          <div className="mt-4 flex w-full flex-1 flex-col px-10 pb-4">
            {timetableSelection[latestMutation.status].element()}
          </div>
          <div className="sticky bottom-6 flex w-full justify-center">
            <button
              className={`w-50 rounded-2xl py-3.5 font-semibold text-white shadow-sm ${latestMutation.status === 'pending' ? 'bg-gray-300' : 'bg-brandPrimary'}`}
              disabled={latestMutation.status === 'pending'}
              onClick={handleNextClick}
              type="button"
            >
              {timetableSelection[latestMutation.status].buttonText}
            </button>
          </div>
        </motion.div>
      </div>
    </AppScreen>
  );
};

export default TimetableSelectionActivity;
