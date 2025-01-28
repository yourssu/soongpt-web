import { Check, ChevronDown, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useDropdown } from '../hooks/useDropDown';
import { Grade } from '../machines/studentMachine';

const grades = [1, 2, 3, 4, 5] as const;

interface GradeInputProps {
  onNext: (grade: Grade) => void;
}

const GradeInput = ({ onNext }: GradeInputProps) => {
  const [grade, setGrade] = useState<Grade>();
  const [showLabel, setShowLabel] = useState(false);
  const [showDropdown, setShowDropdown, dropDownRef] = useDropdown();

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
      <div className="relative" ref={dropDownRef}>
        <div
          className="bg-basic-light focus-visible:ring-ring flex w-full items-center justify-between rounded-lg px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <button
            type="button"
            className={`text-lg font-semibold ${grade ? 'text-primary' : 'text-placeholder'}`}
          >
            {grade ?? '학년'}
          </button>
          <ChevronDown className="size-4" />
        </div>
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              className="bg-basic-light absolute z-10 mt-2 w-full rounded-lg border border-gray-200 shadow-sm"
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
                    className="text-list flex w-full items-center justify-between rounded-lg px-4 py-2 text-lg font-semibold hover:bg-gray-100"
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
          )}
        </AnimatePresence>
        <div className="text-hint mt-1.5 flex items-center gap-2">
          <Info className="size-3" />
          <span className="text-xs">이번 학기에 이수 예정인 학년을 선택해주세요.</span>
        </div>
      </div>
    </motion.div>
  );
};

export default GradeInput;
