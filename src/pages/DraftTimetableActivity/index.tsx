import { useFlow } from '@stackflow/react/future';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SwitchCase } from 'react-simplikit';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useLatestTimetableMutationState } from '@/hooks/timetable/useLatestTimetableMutationState';
import { TimetableError } from '@/pages/DraftTimetableActivity/components/TimetableError';
import { getTimetableMutationStatus } from '@/pages/DraftTimetableActivity/hooks/useTimetableMutationStatus';

export const DraftTimetableActivity = () => {
  const { replace, push } = useFlow();
  const latestMutation = useLatestTimetableMutationState();
  const {
    selectedTimetable,
    setSelectedTimetable,
    setSelectedGeneralElectives,
    setSelectedChapelCourse,
  } = useSelectedTimetableContext();

  const [api, setApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const lastTimetableIdRef = useRef<null | number>(null);

  const timetables = useMemo(
    () => latestMutation?.data?.result.timetables ?? [],
    [latestMutation?.data?.result.timetables],
  );

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setSelectedIndex(api.selectedScrollSnap());
    };

    setSelectedIndex(api.selectedScrollSnap());
    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (timetables.length === 0) {
      setSelectedTimetable(null);
      return;
    }

    const safeIndex = Math.min(selectedIndex, timetables.length - 1);
    if (safeIndex !== selectedIndex) {
      setSelectedIndex(safeIndex);
      api?.scrollTo(safeIndex);
    }

    const nextTimetable = timetables[safeIndex];
    setSelectedTimetable(nextTimetable);

    const nextTimetableId = nextTimetable?.timetableId ?? null;
    if (lastTimetableIdRef.current !== nextTimetableId) {
      setSelectedGeneralElectives([]);
      setSelectedChapelCourse(null);
      lastTimetableIdRef.current = nextTimetableId;
    }
  }, [
    api,
    selectedIndex,
    setSelectedChapelCourse,
    setSelectedGeneralElectives,
    setSelectedTimetable,
    timetables,
  ]);

  if (!latestMutation) {
    replace('landing', {}, { animate: false });
    return null;
  }

  const { status: mutationStatus } = getTimetableMutationStatus(latestMutation);
  if (mutationStatus === 'error400' || mutationStatus === 'error500') {
    return (
      <ActivityLayout>
        <ActivityLayout.ScrollArea>
          <ActivityLayout.Body>
            <TimetableError status={mutationStatus} />
          </ActivityLayout.Body>
        </ActivityLayout.ScrollArea>
      </ActivityLayout>
    );
  }

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body className="items-start">
          <ProgressAppBar progress={50} />

          <div className="mt-6 flex w-full flex-col gap-4">
            <h2 className="text-[24px]/[24px] font-semibold tracking-[-0.48px] whitespace-pre-wrap">
              {timetables.length}개의 시간표 중 마음에 드는
              <br />
              시간표 1개를 골라주세요!
            </h2>
            <p className="text-[14px] font-light tracking-[-0.28px] whitespace-pre-wrap">
              * 선택된 시간표에 맞춰 교양선택 과목 및 채플 추천이 이루어질 예정이에요.
            </p>
          </div>

          <div className="mt-8 w-full">
            <SwitchCase
              caseBy={{
                pending: () => (
                  <div className="w-[303px]">
                    <Timetable.Skeleton />
                  </div>
                ),
                success: () => (
                  <Carousel setApi={setApi}>
                    <CarouselContent className="w-[303px]">
                      {timetables.map((timetable, index) => (
                        <CarouselItem key={timetable.timetableId}>
                          <Timetable isSelected={index === selectedIndex} timetable={timetable} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ),
                idle: () => (
                  <div className="w-[303px]">
                    <Timetable.Skeleton />
                  </div>
                ),
              }}
              value={mutationStatus}
            />
            {mutationStatus === 'success' && timetables.length > 1 && (
              <div className="mt-4 flex w-full justify-center gap-2">
                {timetables.map((timetable, index) => (
                  <div
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === selectedIndex ? 'bg-brandPrimary' : 'bg-neutralDisabled'
                    }`}
                    key={`draft-timetable-indicator-${timetable.timetableId}`}
                  />
                ))}
              </div>
            )}
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          <button
            className="bg-brandPrimary disabled:bg-neutralDisabled disabled:text-text-buttonDisabled w-full rounded-2xl py-3.5 font-semibold text-white"
            disabled={mutationStatus !== 'success' || !selectedTimetable}
            onClick={() => {
              if (!selectedTimetable) {
                return;
              }
              Mixpanel.trackTimetableSelectionClick(selectedTimetable);
              push('general_elective_selection', {});
            }}
            type="button"
          >
            이 시간표 고르기
          </button>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
