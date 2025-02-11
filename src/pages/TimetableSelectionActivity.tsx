import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import { MutationState, MutationStatus, useMutationState } from '@tanstack/react-query';
import useEmblaCarousel from 'embla-carousel-react';
import { ReactElement, useCallback, useEffect, useState } from 'react';
import AppBar from '../components/AppBar';
import Timetable from '../components/Timetable';
import { TimetableSkeleton } from '../components/TimetableSkeleton';
import { SoongptError } from '../schemas/errorSchema.ts';
import { TimetableArrayResponse } from '../schemas/timetableSchema';
import { useFlow } from '../stackflow';
import Warning from '../assets/warning.svg';
import { motion } from 'motion/react';

interface TimetableSelection {
  title: string;
  buttonText: string;
  element: ReactElement;
}

const TimetableSelectionActivity: ActivityComponentType = () => {
  const timetableMutation = useMutationState<MutationState<TimetableArrayResponse, SoongptError>>({
    filters: { mutationKey: ['timetables'] },
  });

  const latestMutation = timetableMutation[timetableMutation.length - 1];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: 'y',
  });

  const { push, replace, pop } = useFlow();

  const onSelect = useCallback(() => {
    if (emblaApi) {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi) {
      onSelect();
      emblaApi.on('select', onSelect);
      return () => {
        emblaApi.off('select', onSelect);
      };
    }
  }, [emblaApi, onSelect]);

  const handleNextClick = () => {
    if (latestMutation.status === 'error') {
      pop(2);
    }

    if (latestMutation.data) {
      const selectedTimetable = latestMutation.data.result.timetables[selectedIndex];

      push('TimetableSharingActivity', {
        timetableId: selectedTimetable.timetableId,
      });
    }
  };

  useEffect(() => {
    if (!latestMutation) replace('OnboardingActivity', {}, { animate: false });
  }, [latestMutation, replace]);

  if (!latestMutation) {
    return null;
  }

  const timetableSelection: Record<MutationStatus, TimetableSelection> = {
    pending: {
      title: '가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: (
        <div className="mt-4 w-full flex-1 overflow-hidden px-10" ref={emblaRef}>
          <div className="-mt-4 flex h-full flex-col" style={{ maxHeight: 'calc(100dvh - 250px)' }}>
            <TimetableSkeleton className="pt-4">
              <TimetableSkeleton.Header />
            </TimetableSkeleton>
          </div>
        </div>
      ),
    },
    success: {
      title: '가져왔어요!',
      buttonText: '이 시간표가 좋아요',
      element: (
        <div className="mt-4 w-full flex-1 overflow-hidden px-10" ref={emblaRef}>
          <div className="-mt-4 flex h-full flex-col" style={{ maxHeight: 'calc(100dvh - 250px)' }}>
            {latestMutation.data &&
              latestMutation.data.result.timetables.map((timetable, index) => (
                <div
                  key={timetable.timetableId}
                  className={`min-h-0 flex-shrink-0 transform-gpu pt-4 first:pt-0`}
                >
                  <Timetable
                    timetable={timetable}
                    className={`${index === selectedIndex ? 'border-primary' : 'border-placeholder'}`}
                  >
                    <Timetable.Header
                      className={`${index === selectedIndex ? 'bg-primary text-white' : 'border-placeholder border-b-1'}`}
                    />
                  </Timetable>
                </div>
              ))}
          </div>
        </div>
      ),
    },
    error: {
      title: '찾지 못했어요..',
      buttonText: '다시 만들기',
      element: <img className="m-auto" src={Warning} alt="warning" />,
    },
    idle: {
      title: '가져오는 중이에요!',
      buttonText: '이 시간표가 좋아요',
      element: <></>,
    },
  };

  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-6">
        <AppBar progress={100} />
        <motion.div
          key={latestMutation.status}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4 flex flex-1 flex-col items-center"
        >
          <h2 className="text-center text-[28px] font-semibold whitespace-pre-wrap">
            {`사용자님을 위한\n시간표를 ${timetableSelection[latestMutation.status].title}`}
          </h2>
          {timetableSelection[latestMutation.status].element}
          <button
            type="button"
            className={`mt-4 w-50 rounded-2xl py-3.5 font-semibold text-white ${latestMutation.status === 'pending' ? 'bg-gray-300' : 'bg-primary'}`}
            disabled={latestMutation.status === 'pending'}
            onClick={handleNextClick}
          >
            {timetableSelection[latestMutation.status].buttonText}
          </button>
        </motion.div>
      </div>
    </AppScreen>
  );
};

export default TimetableSelectionActivity;
