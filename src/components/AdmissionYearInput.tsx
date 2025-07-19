import * as Popover from '@radix-ui/react-popover';
import { ErrorBoundaryProps } from '@sentry/react';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { admissionYears } from '@/data/admissionYears';

interface AdmissionYearInputProps {
  a?: ErrorBoundaryProps;
  initialValue: number | undefined;
  onNext: (admissionYear: number) => void;
}

const AdmissionYearInput = ({ onNext, initialValue }: AdmissionYearInputProps) => {
  const [admissionYear, setAdmissionYear] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(admissionYear !== 0);
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
      {showLabel && <label className="mb-1.5 block text-sm">입학년도(학번)</label>}

      <Popover.Root onOpenChange={setShowDropdown} open={showDropdown}>
        <Popover.Trigger asChild>
          <button
            className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${admissionYear === 0 ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
            type="button"
          >
            {admissionYear === 0 ? '입학년도(학번)' : admissionYear}
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
                className="bg-bg-layerDefault z-10 max-h-55 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                initial={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                }}
              >
                {admissionYears.map((year) => (
                  <li key={year}>
                    <button
                      className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => {
                        handleAdmissionYearSelect(year);
                      }}
                      type="button"
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
