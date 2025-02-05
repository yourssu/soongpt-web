import { AppScreen } from '@stackflow/plugin-basic-ui';
import { ActivityComponentType } from '@stackflow/react';

import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import AppBar from '../components/AppBar';
import RollingNumber from '../components/RollingNumber';

interface DesiredCreditParams {
  majorRequired: number;
  majorElective: number;
  generalRequired: number;
}

const Classification = {
  majorRequired: '전공필수',
  majorElective: '전공선택',
  generalRequired: '교양필수',
  generalElective: '교양선택',
};

const MAX_CREDIT = 22;

const DesiredCreditActivity: ActivityComponentType<DesiredCreditParams> = ({ params: credit }) => {
  const totalCredit = Object.values(credit).reduce((acc, credit) => acc + credit, 0); // 전공필수 + 전공선택 + 교양필수
  const availableCredits = Array.from({ length: MAX_CREDIT - totalCredit + 1 }, (_, i) => i); // 수강 가능한 교양선택 학점

  const [desiredCredit, setDesiredCredit] = useState(totalCredit);
  const [generalElective, setGeneralElective] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCreditSelect = (credit: number) => {
    setGeneralElective(credit);
    setDesiredCredit(totalCredit + credit);
    setShowDropdown(false);
  };

  return (
    <AppScreen>
      <div className="min-h-screen py-12">
        <AppBar progress={100} />
        <div className="mt-15 flex flex-col items-center">
          <h2 className="text-center text-[28px] font-semibold">
            사용자님의 이번학기 <br />
            희망 학점은 <RollingNumber number={desiredCredit} className="text-primary" />
            학점이군요!
          </h2>
          <span className="mt-1 font-light">희망 학점에 맞추어 교양선택과목을 추천해드릴게요.</span>
          <div className="mt-15 grid grid-cols-2 gap-x-2.5 gap-y-6 px-12">
            {Object.entries(credit).map(([key, value]) => (
              <div key={key}>
                <label className="mb-1.5 block text-sm">
                  {Classification[key as keyof typeof Classification]} 학점
                </label>
                <input
                  type="number"
                  disabled
                  value={value}
                  className="bg-basic-light text-primary w-full rounded-xl px-4 py-3 text-lg font-semibold"
                />
              </div>
            ))}
            <div>
              <label className="mb-1.5 block text-sm">교양선택 학점</label>

              <Popover.Root open={showDropdown} onOpenChange={setShowDropdown}>
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
                  {showDropdown && (
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
                        {availableCredits.map((availableCredit) => (
                          <li key={availableCredit}>
                            <button
                              type="button"
                              className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                              onClick={() => handleCreditSelect(availableCredit)}
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

          {generalElective > 0 && (
            <motion.button
              type="button"
              className="bg-primary mt-57 w-50 rounded-2xl py-3.5 font-semibold text-white"
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
