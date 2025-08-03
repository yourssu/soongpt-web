import * as Popover from '@radix-ui/react-popover';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { departments } from '@/types/student';

interface DepartmentInputProps {
  initialValue: string | undefined;
  onNext: (department: string) => void;
}

const DepartmentInput = ({ onNext, initialValue }: DepartmentInputProps) => {
  const [department, setDepartment] = useState(initialValue ?? '');
  const [matchingDepartments, setMatchingDepartments] = useState<string[]>([]);
  const [showLabel, setShowLabel] = useState(initialValue !== undefined);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setDepartment(value);

    const matches = departments.filter(
      (dept) => value !== '' && dept.toLowerCase().includes(value.toLowerCase()),
    );
    setMatchingDepartments(matches);
  };

  const handleDepartmentSelect = (department: string) => {
    setDepartment(department);
    setMatchingDepartments([]);

    // 라벨 보이기
    setShowLabel(true);
    // 다음 단계로 넘어가기
    onNext(department);
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
      {showLabel && <label className="mb-1.5 block text-sm">학과</label>}

      <Popover.Root open={matchingDepartments.length > 0}>
        <Popover.Trigger asChild>
          <input
            className="bg-bg-layerDefault text-brandPrimary focus-visible:outline-borderRing w-full rounded-xl px-4 py-3 text-lg font-semibold"
            onChange={handleInputChange}
            placeholder="학과"
            type="text"
            value={department}
          />
        </Popover.Trigger>

        <AnimatePresence>
          {matchingDepartments.length > 0 && (
            <Popover.Content
              asChild
              forceMount
              onCloseAutoFocus={(e) => e.preventDefault()}
              onOpenAutoFocus={(e) => e.preventDefault()}
              sideOffset={5}
            >
              <motion.ul
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="bg-bg-layerDefault z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
                exit={{ opacity: 0, y: -10 }}
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                transition={{ duration: 0.2 }}
              >
                {matchingDepartments.map((dept) => (
                  <li key={dept}>
                    <button
                      className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => handleDepartmentSelect(dept)}
                      type="button"
                    >
                      {dept}
                      {department === dept && <Check className="size-4 text-green-500" />}
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

export default DepartmentInput;
