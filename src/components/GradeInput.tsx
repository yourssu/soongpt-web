import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { grades } from '../data/grades';
import { Grade } from '../machines/studentMachine';

interface GradeInputProps {
  initialValue: Grade | undefined;
  onNext: (grade: Grade) => void;
}

const GradeInput = ({ onNext, initialValue }: GradeInputProps) => {
  const [grade, setGrade] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(initialValue !== undefined);
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
      initial={{
        opacity: 0,
        y: -20,
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
    >
      {showLabel && <label className="mb-1.5 block text-sm">학년</label>}

      <Popover.Root open={showDropdown} onOpenChange={setShowDropdown}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`bg-basic-light focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${grade ? 'text-primary' : 'text-placeholder'}`}
          >
            {grade ?? '학년'}
            <ChevronDown className="text-text size-4" />
          </button>
        </Popover.Trigger>

        <AnimatePresence>
          {showDropdown && (
            <Popover.Content asChild sideOffset={5} forceMount>
              <motion.ul
                className="bg-basic-light z-10 w-[var(--radix-popover-trigger-width)] rounded-xl border border-gray-200 shadow-sm"
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
                {grades.map((gradeOption) => (
                  <li key={gradeOption}>
                    <button
                      type="button"
                      className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => {
                        handleGradeSelect(gradeOption);
                      }}
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

      <div className="text-hint mt-1.5 flex items-center gap-2">
        <Info className="size-3" />
        <span className="text-xs">이번 학기에 이수 예정인 학년을 선택해주세요.</span>
      </div>
    </motion.div>
  );
};

export default GradeInput;
