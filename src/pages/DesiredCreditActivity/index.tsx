import * as Popover from '@radix-ui/react-popover';
import { ActivityComponentType } from '@stackflow/react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import Hint from '@/components/Hint';
import { StudentMachineContext } from '@/contexts/StudentMachineContext';
import { usePostTimetable } from '@/hooks/usePostTimetable';
import RollingNumber from '@/pages/DesiredCreditActivity/components/RollingNumber';
import { useFlow } from '@/stackflow';

type DesiredCreditParams = {
  generalRequired: number;
  generalRequiredCourses: string[];
  majorElective: number;
  majorElectiveCourses: string[];
  majorRequired: number;
  majorRequiredCourses: string[];
};

const getAvailableCredits = (currentCredit: number, baseCredit: number = 0): number[] => {
  return Array.from({ length: MAX_CREDIT - currentCredit + 1 }, (_, i) => i + baseCredit);
};

type Classification = '교양선택' | '교양필수' | '전공선택' | '전공필수';

const MAX_CREDIT = 22.5;

const DesiredCreditActivity: ActivityComponentType<DesiredCreditParams> = ({ params }) => {
  const context = StudentMachineContext.useSelector((state) => state.context);
  const chapelCredit = context.chapel ? 0.5 : 0;

  const previousCredit =
    params.majorRequired + params.majorElective + params.generalRequired + chapelCredit; // 과목 선택 페이지에서 선택한 전필 + 전선 + 교필 학점 + 채플 학점

  const [desiredCredit, setDesiredCredit] = useState(previousCredit); // 희망 학점

  const [availableMajorElective, setAvailableMajorElective] = useState(() =>
    getAvailableCredits(previousCredit, params.majorElective),
  ); // 수강 가능한 전공선택 학점
  const [availableGeneralElective, setAvailableGeneralElective] = useState(() =>
    getAvailableCredits(previousCredit),
  ); // 수강 가능한 교양선택 학점

  const [majorElective, setMajorElective] = useState(params.majorElective); // 전공선택 학점
  const [generalElective, setGeneralElective] = useState(0); // 교양선택 학점

  const [showMajorElectiveDropdown, setShowMajorElectiveDropdown] = useState(false);
  const [showGeneralElectiveDropdown, setShowGeneralElectiveDropdown] = useState(false);

  const postTimetableMutation = usePostTimetable();

  const { push } = useFlow();

  const handleCreditSelect = ({
    type,
    selectedCredit,
  }: {
    selectedCredit: number;
    type: Classification;
  }) => {
    if (type === '전공선택') {
      const majorElectiveDiff = selectedCredit - majorElective;

      setMajorElective(selectedCredit);
      setDesiredCredit((prev) => prev + majorElectiveDiff);
      setAvailableGeneralElective(
        getAvailableCredits(desiredCredit + majorElectiveDiff - generalElective),
      );

      setShowMajorElectiveDropdown(false);
    } else if (type === '교양선택') {
      const generalElectiveDiff = selectedCredit - generalElective;
      const majorElectiveDiff = majorElective - params.majorElective;

      setGeneralElective(selectedCredit);
      setDesiredCredit((prev) => prev + generalElectiveDiff);
      setAvailableMajorElective(
        getAvailableCredits(
          desiredCredit + generalElectiveDiff - majorElectiveDiff,
          params.majorElective,
        ),
      );

      setShowGeneralElectiveDropdown(false);
    }
  };

  const handleNextClick = () => {
    // 시간표 추천 API 요청
    postTimetableMutation.mutate({
      schoolId: context.admissionYear,
      department: context.department,
      grade: context.grade,
      isChapel: context.chapel,
      majorRequiredCourses: params.majorRequiredCourses,
      majorElectiveCourses: params.majorElectiveCourses,
      generalRequiredCourses: params.generalRequiredCourses,
      majorElectiveCredit: majorElective,
      generalElectiveCredit: generalElective,
    });

    // Mixpanel 이벤트 추적
    Mixpanel.trackDesiredCreditClick({
      majorRequiredCourses: params.majorRequiredCourses,
      majorElectiveCourses: params.majorElectiveCourses,
      generalRequiredCourses: params.generalRequiredCourses,
      majorElectiveCredit: majorElective,
      generalElectiveCredit: generalElective,
    });

    push('TimetableSelectionActivity', {});
  };

  return (
    <ActivityLayout>
      <ProgressAppBar progress={100} />
      <div className="mt-6 flex flex-1 flex-col items-center">
        <h2 className="text-center text-[28px] font-semibold">
          사용자님의 이번학기 <br />
          희망 학점은{' '}
          <RollingNumber
            className="text-brandPrimary"
            decimals={context.chapel ? 1 : 0}
            number={desiredCredit}
          />
          학점이군요!
        </h2>
        <span className="mt-1 font-light">희망 학점에 맞추어 선택과목을 추천해드릴게요.</span>
        <div className="mt-6 grid grid-cols-2 gap-x-2.5 gap-y-6 px-12">
          <div>
            <label className="mb-1.5 block text-sm">전공필수 학점</label>
            <input
              className="bg-bg-layerDefault text-brandPrimary w-full rounded-xl px-4 py-3 text-lg font-semibold"
              disabled
              type="number"
              value={params.majorRequired}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm">전공선택 학점</label>
            <Popover.Root
              onOpenChange={setShowMajorElectiveDropdown}
              open={showMajorElectiveDropdown}
            >
              <Popover.Trigger asChild>
                <button
                  className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${majorElective === params.majorElective ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
                  type="button"
                >
                  {majorElective}
                  <ChevronDown className="text-neutral size-4" />
                </button>
              </Popover.Trigger>

              <AnimatePresence>
                {showMajorElectiveDropdown && (
                  <Popover.Content asChild forceMount sideOffset={5}>
                    <motion.ul
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-bg-layerDefault z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      {availableMajorElective.map((availableCredit) => (
                        <li key={availableCredit}>
                          <button
                            className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                            onClick={() =>
                              handleCreditSelect({
                                type: '전공선택',
                                selectedCredit: availableCredit,
                              })
                            }
                            type="button"
                          >
                            {availableCredit}
                            {availableCredit === majorElective && (
                              <Check className="size-4 text-green-500" />
                            )}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </Popover.Content>
                )}
              </AnimatePresence>
            </Popover.Root>
          </div>

          <div>
            <label className="mb-1.5 block text-sm">교양필수 학점</label>
            <input
              className="bg-bg-layerDefault text-brandPrimary w-full rounded-xl px-4 py-3 text-lg font-semibold"
              disabled
              type="number"
              value={params.generalRequired}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm">교양선택 학점</label>

            <Popover.Root
              onOpenChange={setShowGeneralElectiveDropdown}
              open={showGeneralElectiveDropdown}
            >
              <Popover.Trigger asChild>
                <button
                  className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${generalElective === 0 ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
                  type="button"
                >
                  {generalElective}
                  <ChevronDown className="text-neutral size-4" />
                </button>
              </Popover.Trigger>

              <AnimatePresence>
                {showGeneralElectiveDropdown && (
                  <Popover.Content asChild forceMount sideOffset={5}>
                    <motion.ul
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      className="bg-bg-layerDefault z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                      exit={{
                        opacity: 0,
                        y: -10,
                      }}
                      initial={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.2,
                      }}
                    >
                      {availableGeneralElective.map((availableCredit) => (
                        <li key={availableCredit}>
                          <button
                            className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                            onClick={() =>
                              handleCreditSelect({
                                type: '교양선택',
                                selectedCredit: availableCredit,
                              })
                            }
                            type="button"
                          >
                            {availableCredit}
                            {availableCredit === generalElective && (
                              <Check className="size-4 text-green-500" />
                            )}
                          </button>
                        </li>
                      ))}
                    </motion.ul>
                  </Popover.Content>
                )}
              </AnimatePresence>
            </Popover.Root>
          </div>
        </div>

        <Hint className="mt-2 self-start px-12">
          <Hint.Icon />
          <Hint.Text>이수 가능한 최대 학점은 22학점이에요.</Hint.Text>
        </Hint>

        <motion.button
          animate={{ opacity: 1, y: 0 }}
          className="bg-brandPrimary mt-auto w-50 rounded-2xl py-3.5 font-semibold text-white"
          initial={{
            opacity: 0,
            y: 20,
          }}
          onClick={handleNextClick}
          transition={{
            duration: 0.3,
            ease: 'easeOut',
          }}
          type="button"
        >
          네 맞아요
        </motion.button>
      </div>
    </ActivityLayout>
  );
};

export default DesiredCreditActivity;
