import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { admissionYears } from '../data/admissionYears';

interface AdmissionYearInputProps {
  initialValue: number | undefined;
  onNext: (admissionYear: number) => void;
}

const AdmissionYearInput = ({ onNext, initialValue }: AdmissionYearInputProps) => {
  const [admissionYear, setAdmissionYear] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(admissionYear !== undefined);
  const [showDropdown, setShowDropdown] = useState(false);

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

      <Popover.Root open={showDropdown} onOpenChange={setShowDropdown}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`bg-basic-light focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${admissionYear ? 'text-primary' : 'text-placeholder'}`}
          >
            {admissionYear ?? '입학년도(학번)'}
            <ChevronDown className="text-text size-4" />
          </button>
        </Popover.Trigger>

        <AnimatePresence>
          {showDropdown && (
            <Popover.Content asChild sideOffset={5} forceMount>
              <motion.ul
                className="bg-basic-light z-10 max-h-55 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
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
                      className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
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
            </Popover.Content>
          )}
        </AnimatePresence>
      </Popover.Root>
    </motion.div>
  );
};

export default AdmissionYearInput;
