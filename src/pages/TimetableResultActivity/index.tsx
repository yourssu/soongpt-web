import { useFlow } from '@stackflow/react/future';

import { ActivityLayout } from '@/components/ActivityLayout';
import { BaseAppBar } from '@/components/AppBar/BaseAppBar';
import { useSelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/hook';
import { Timetable } from '@/components/Timetable';
import { STAGE } from '@/config';
import { useSafeActivityParams } from '@/hooks/stackflow/useSafeActivityParams';
import { useLatestTimetableMutationState } from '@/pages/DraftTimetableActivity/hooks/useLatestTimetableMutationState';
import { TimetableType } from '@/schemas/timetableSchema';
import { mergeTimetableCourses } from '@/utils/timetableSelection';

const MOCK_TIMETABLE_STORAGE_KEY = 'timetable-result-mock';

const imgLine10 = 'http://localhost:3845/assets/54ddd31efb840ae8d0dd1a7ee301344d951c135a.svg';
const imgLine11 = 'http://localhost:3845/assets/f0e2e853e343426a9af10f6c91613d00d74b6d08.svg';
const imgVector1 = 'http://localhost:3845/assets/f5cb4600286ee912fd643bd9b7b2d8baee116d24.svg';

const ProgressBarTrack = ({ className }: { className?: string }) => {
  return (
    <div className={className ?? 'h-0 w-[260px]'}>
      <div className="absolute top-0 right-0 bottom-full left-0">
        <div className="absolute inset-[-8px_0_0_0]">
          <img alt="" className="block size-full max-w-none" src={imgLine10} />
        </div>
      </div>
      <div className="absolute top-0 right-[65.67%] bottom-full left-0">
        <div className="absolute inset-[-8px_0_0_0]">
          <img alt="" className="block size-full max-w-none" src={imgLine11} />
        </div>
      </div>
    </div>
  );
};

const ProgressBar = ({ className }: { className?: string }) => {
  return (
    <div className={className ?? 'h-[13px] w-[293px]'}>
      <ProgressBarTrack className="absolute inset-[84.62%_0_15.38%_11.26%]" />
      <div className="absolute inset-[0_97.78%_0_0]">
        <div className="absolute inset-[-7.69%_-15.38%_-7.69%_-21.76%]">
          <img alt="" className="block size-full max-w-none" src={imgVector1} />
        </div>
      </div>
    </div>
  );
};

export const TimetableResultActivity = () => {
  const { timetableId } = useSafeActivityParams('timetable_result');
  const { replace } = useFlow();
  const { selectedTimetable, selectedGeneralElectives, selectedChapelCourse } =
    useSelectedTimetableContext();
  const latestMutation = useLatestTimetableMutationState();

  const timetables = latestMutation?.data?.result.timetables ?? [];
  const timetableFromMutation = timetables.find(
    (timetable) => timetable.timetableId === timetableId,
  );
  const mockTimetable: TimetableType | undefined =
    STAGE !== 'prod'
      ? (() => {
          try {
            const raw = localStorage.getItem(MOCK_TIMETABLE_STORAGE_KEY);
            if (!raw) {
              return undefined;
            }
            return JSON.parse(raw);
          } catch {
            return undefined;
          }
        })()
      : undefined;

  const baseTimetable = selectedTimetable ?? timetableFromMutation ?? mockTimetable;

  if (!baseTimetable) {
    replace('landing', {}, { animate: false });
    return undefined;
  }

  const timetableToRender =
    selectedGeneralElectives.length > 0 || selectedChapelCourse
      ? mergeTimetableCourses(baseTimetable, selectedGeneralElectives, selectedChapelCourse)
      : baseTimetable;

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <BaseAppBar className="relative items-center">
            <ProgressBar className="relative h-[13px] w-[293px]" />
          </BaseAppBar>
        </ActivityLayout.Header>
        <ActivityLayout.Body className="gap-7">
          <div className="flex w-full max-w-[300px] flex-col gap-4">
            <h2 className="text-[24px]/[24px] font-semibold tracking-[-0.48px] whitespace-pre-wrap">
              완성된 26-1 시간표에요!\n마음에 드시나요?
            </h2>
            <p className="text-sm font-light tracking-[-0.28px]">
              * 완성된 26-1 시간표와 숭피티가 마음에 든다면\n추천인 이벤트에 참여해보세요 :)
            </p>
          </div>
          <div className="w-full max-w-[303px] overflow-hidden rounded-xl">
            <div className="max-h-[417px] overflow-y-auto">
              <Timetable isSelected timetable={timetableToRender} />
            </div>
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
      <ActivityLayout.Footer>
        <button
          className="bg-brandPrimary h-14 w-full rounded-2xl text-base font-semibold text-white"
          type="button"
        >
          추천인 이벤트 참여하기
        </button>
      </ActivityLayout.Footer>
    </ActivityLayout>
  );
};
