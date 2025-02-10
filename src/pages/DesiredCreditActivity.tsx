import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import AppBar from '../components/AppBar';
import Hint from '../components/Hint';
import RollingNumber from '../components/RollingNumber';
import { usePostTimetable } from '../hooks/usePostTimetable';
import { StudentMachineContext } from '../machines/studentMachine';
import { useFlow } from '../stackflow';

type DesiredCreditParams = {
  majorRequired: number;
  majorElective: number;
  generalRequired: number;
  majorRequiredCourses: string[];
  majorElectiveCourses: string[];
  generalRequiredCourses: string[];
};

const getAvailableCredits = (currentCredit: number, baseCredit: number = 0): number[] => {
  return Array.from({ length: MAX_CREDIT - currentCredit + 1 }, (_, i) => i + baseCredit);
};

type Classification = '전공필수' | '전공선택' | '교양필수' | '교양선택';

const MAX_CREDIT = 22;

const DesiredCreditActivity: ActivityComponentType<DesiredCreditParams> = ({ params }) => {
  const previousCredit = params.majorRequired + params.majorElective + params.generalRequired; // 과목 선택 페이지에서 선택한 전필 + 전선 + 교필 학점
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

  const context = StudentMachineContext.useSelector((state) => state.context);
  const postTimetableMutation = usePostTimetable();

  const { push } = useFlow();

  const handleCreditSelect = ({
    type,
    selectedCredit,
  }: {
    type: Classification;
    selectedCredit: number;
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

    push('TimetableSelectionActivity', {});
  };

  return (
    <AppScreen>
      <div className="flex min-h-dvh flex-col py-12">
        <AppBar progress={100} />
        <div className="mt-6 flex flex-1 flex-col items-center">
          <h2 className="text-center text-[28px] font-semibold">
            사용자님의 이번학기 <br />
            희망 학점은 <RollingNumber number={desiredCredit} className="text-primary" />
            학점이군요!
          </h2>
          <span className="mt-1 font-light">희망 학점에 맞추어 선택과목을 추천해드릴게요.</span>
          <div className="mt-6 grid grid-cols-2 gap-x-2.5 gap-y-6 px-12">
            <div>
              <label className="mb-1.5 block text-sm">전공필수 학점</label>
              <input
                type="number"
                disabled
                value={params.majorRequired}
                className="bg-basic-light text-primary w-full rounded-xl px-4 py-3 text-lg font-semibold"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm">전공선택 학점</label>
              <Popover.Root
                open={showMajorElectiveDropdown}
                onOpenChange={setShowMajorElectiveDropdown}
              >
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className={`bg-basic-light focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${majorElective === params.majorElective ? 'text-placeholder' : 'text-primary'}`}
                  >
                    {majorElective}
                    <ChevronDown className="text-text size-4" />
                  </button>
                </Popover.Trigger>

                <AnimatePresence>
                  {showMajorElectiveDropdown && (
                    <Popover.Content asChild sideOffset={5} forceMount>
                      <motion.ul
                        className="bg-basic-light z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        {availableMajorElective.map((availableCredit) => (
                          <li key={availableCredit}>
                            <button
                              type="button"
                              className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                              onClick={() =>
                                handleCreditSelect({
                                  type: '전공선택',
                                  selectedCredit: availableCredit,
                                })
                              }
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
                type="number"
                disabled
                value={params.generalRequired}
                className="bg-basic-light text-primary w-full rounded-xl px-4 py-3 text-lg font-semibold"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm">교양선택 학점</label>

              <Popover.Root
                open={showGeneralElectiveDropdown}
                onOpenChange={setShowGeneralElectiveDropdown}
              >
                <Popover.Trigger asChild>
                  <button
                    type="button"
                    className={`bg-basic-light focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${generalElective === 0 ? 'text-placeholder' : 'text-primary'}`}
                  >
                    {generalElective}
                    <ChevronDown className="text-text size-4" />
                  </button>
                </Popover.Trigger>

                <AnimatePresence>
                  {showGeneralElectiveDropdown && (
                    <Popover.Content asChild sideOffset={5} forceMount>
                      <motion.ul
                        className="bg-basic-light z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: -10,
                        }}
                        transition={{
                          duration: 0.2,
                        }}
                      >
                        {availableGeneralElective.map((availableCredit) => (
                          <li key={availableCredit}>
                            <button
                              type="button"
                              className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                              onClick={() =>
                                handleCreditSelect({
                                  type: '교양선택',
                                  selectedCredit: availableCredit,
                                })
                              }
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

          {(majorElective !== params.majorElective || generalElective > 0) && (
            <motion.button
              onClick={handleNextClick}
              type="button"
              className="bg-primary mt-auto w-50 rounded-2xl py-3.5 font-semibold text-white"
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
            >
              네 맞아요
            </motion.button>
          )}
        </div>
      </div>
    </AppScreen>
  );
};

export default DesiredCreditActivity;
