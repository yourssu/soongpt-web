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
import { useToast } from '@/hooks/useToast';
import { TimetableError } from '@/pages/DraftTimetableActivity/components/TimetableError';
import { getTimetableMutationStatus } from '@/pages/DraftTimetableActivity/hooks/useTimetableMutationStatus';
import { FLOW_PROGRESS } from '@/stackflow/progress';

export const DraftTimetableActivity = () => {
  const { push, replace } = useFlow();
  const toast = useToast();
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

  const hasPeek = timetables.length > 1;
  const carouselIndexOffset = hasPeek ? 1 : 0;
  const lastTimetableIndex = timetables.length - 1;

  const clampTimetableIndex = (index: number) => Math.max(0, Math.min(index, lastTimetableIndex));
  const toSnapIndex = (index: number) => index + carouselIndexOffset;
  const toTimetableIndex = (snapIndex: number) => snapIndex - carouselIndexOffset;

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      const snapIndex = api.selectedScrollSnap();

      if (hasPeek) {
        const lastSnapIndex = api.scrollSnapList().length - 1;

        if (snapIndex === 0) {
          api.scrollTo(1);
          return;
        }

        if (snapIndex === lastSnapIndex) {
          api.scrollTo(lastSnapIndex - 1);
          return;
        }
      }

      setSelectedIndex(clampTimetableIndex(toTimetableIndex(snapIndex)));
    };

    if (hasPeek) {
      api.scrollTo(toSnapIndex(0), true);
      setSelectedIndex(0);
    } else {
      setSelectedIndex(clampTimetableIndex(api.selectedScrollSnap()));
    }
    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api, carouselIndexOffset, hasPeek, lastTimetableIndex, timetables.length]);

  useEffect(() => {
    if (timetables.length === 0) {
      setSelectedTimetable(null);
      return;
    }

    const safeIndex = clampTimetableIndex(selectedIndex);
    if (safeIndex !== selectedIndex) {
      setSelectedIndex(safeIndex);
      api?.scrollTo(toSnapIndex(safeIndex));
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
    carouselIndexOffset,
    selectedIndex,
    setSelectedChapelCourse,
    setSelectedGeneralElectives,
    setSelectedTimetable,
    timetables,
  ]);

  if (!latestMutation) {
    toast.error('시간표 생성 결과를 찾지 못해 처음 화면으로 이동했어요.');
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
          <ProgressAppBar progress={FLOW_PROGRESS.draft_timetable} />

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

          <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2">
            <SwitchCase
              caseBy={{
                pending: () => (
                  <div className="mx-auto w-[303px]">
                    <Timetable.Skeleton />
                  </div>
                ),
                success: () => (
                  <Carousel opts={{ align: 'center', containScroll: 'keepSnaps' }} setApi={setApi}>
                    <CarouselContent className="ml-0 w-full gap-4">
                      {hasPeek && (
                        <CarouselItem aria-hidden className="pointer-events-none basis-[303px]" />
                      )}
                      {timetables.map((timetable, index) => (
                        <CarouselItem
                          className="basis-[303px] justify-center pr-0 pl-0"
                          key={timetable.timetableId}
                        >
                          <Timetable isSelected={index === selectedIndex} timetable={timetable} />
                        </CarouselItem>
                      ))}
                      {hasPeek && (
                        <CarouselItem aria-hidden className="pointer-events-none basis-[303px]" />
                      )}
                    </CarouselContent>
                  </Carousel>
                ),
                idle: () => (
                  <div className="mx-auto w-[303px]">
                    <Timetable.Skeleton />
                  </div>
                ),
              }}
              value={mutationStatus}
            />
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          {mutationStatus === 'success' && timetables.length > 1 && (
            <div className="mb-3 flex w-full justify-center gap-2">
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
