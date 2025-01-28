import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useDropdown } from '../hooks/useDropDown';

const admissionYears = [25, 24, 23, 22, 21, 20, 19, 18];

interface AdmissionYearInputProps {
  onNext: (admissionYear: number) => void;
}

const AdmissionYearInput = ({ onNext }: AdmissionYearInputProps) => {
  const [admissionYear, setAdmissionYear] = useState<number>();
  const [showLabel, setShowLabel] = useState(false);
  const [showDropdown, setShowDropdown, dropDownRef] = useDropdown();

  const handleAdmissionYearSelect = (year: number) => {
    setAdmissionYear(year);
    setShowDropdown(false);

    // 라벨 보이기
    setShowLabel(true);
    // 다음 단계로 넘어가기
    onNext(year);
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
      {showLabel && <label className="mb-1.5 block text-sm">입학년도(학번)</label>}
      <div className="relative" ref={dropDownRef}>
        <div
          className="bg-basic-light focus-visible:ring-ring flex w-full items-center justify-between rounded-lg px-4 py-3 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <button
            type="button"
            className={`text-lg font-semibold ${admissionYear ? 'text-primary' : 'text-placeholder'}`}
          >
            {admissionYear ?? '입학년도(학번)'}
          </button>
          <ChevronDown className="size-4" />
        </div>
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              className="bg-basic-light absolute z-10 mt-2 max-h-55 w-full overflow-y-auto rounded-lg border border-gray-200 shadow-sm"
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
              {admissionYears.map((year) => (
                <li key={year}>
                  <button
                    type="button"
                    className="text-list flex w-full items-center justify-between rounded-lg px-4 py-2 text-lg font-semibold hover:bg-gray-100"
                    onClick={() => {
                      handleAdmissionYearSelect(year);
                    }}
                  >
                    {year}
                    {admissionYear === year && <Check className="size-4 text-green-500" />}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdmissionYearInput;
