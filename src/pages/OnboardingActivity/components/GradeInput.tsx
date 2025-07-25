import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import Hint from '@/components/Hint';
import { Grade } from '@/schemas/studentSchema';
import { grades } from '@/types/grades';

interface GradeInputProps {
  initialValue: Grade | undefined;
  onNext: (grade: Grade) => void;
}

const GradeInput = ({ onNext, initialValue }: GradeInputProps) => {
  const [grade, setGrade] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(initialValue !== 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleGradeSelect = (grade: Grade) => {
    setGrade(grade);
    setShowDropdown(false);

    // 라벨 보이기
    setShowLabel(true);
    // 다음 단계로 넘어가기
    onNext(grade);
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{
        opacity: 0,
        y: -20,
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      {showLabel && <label className="mb-1.5 block text-sm">학년</label>}

      <Popover.Root onOpenChange={setShowDropdown} open={showDropdown}>
        <Popover.Trigger asChild>
          <button
            className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${grade === 0 ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
            type="button"
          >
            {grade === 0 ? '학년' : grade}
            <ChevronDown className="text-neutral size-4" />
          </button>
        </Popover.Trigger>

        <AnimatePresence>
          {showDropdown && (
            <Popover.Content asChild forceMount sideOffset={5}>
              <motion.ul
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-bg-layerDefault z-10 w-[var(--radix-popover-trigger-width)] rounded-xl border border-gray-200 shadow-sm"
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                initial={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                }}
              >
                {grades.map((gradeOption) => (
                  <li key={gradeOption}>
                    <button
                      className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => {
                        handleGradeSelect(gradeOption);
                      }}
                      type="button"
                    >
                      {gradeOption}
                      {grade === gradeOption && <Check className="size-4 text-green-500" />}
                    </button>
                  </li>
                ))}
              </motion.ul>
            </Popover.Content>
          )}
        </AnimatePresence>
      </Popover.Root>

      <Hint className="mt-2">
        <Hint.Icon />
        <Hint.Text>이번 학기에 이수 예정인 학년을 선택해주세요.</Hint.Text>
      </Hint>
    </motion.div>
  );
};

export default GradeInput;
