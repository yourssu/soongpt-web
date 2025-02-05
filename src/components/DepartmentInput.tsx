import * as Popover from '@radix-ui/react-popover';
import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { departments } from '../data/departments';

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

    const matches = departments.filter((dept) => value !== '' && dept.includes(value));
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
      {showLabel && <label className="mb-1.5 block text-sm">학과</label>}

      <Popover.Root open={matchingDepartments.length > 0}>
        <Popover.Trigger asChild>
          <input
            type="text"
            value={department}
            onChange={handleInputChange}
            className="bg-basic-light text-primary focus-visible:outline-ring w-full rounded-xl px-4 py-3 text-lg font-semibold"
            placeholder="학과"
          />
        </Popover.Trigger>

        <AnimatePresence>
          {matchingDepartments.length > 0 && (
            <Popover.Content
              asChild
              sideOffset={5}
              forceMount
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.ul
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="bg-basic-light z-10 max-h-44 w-[var(--radix-popover-trigger-width)] overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
              >
                {matchingDepartments.map((dept) => (
                  <li key={dept}>
                    <button
                      type="button"
                      className="text-list focus-visible:outline-ring flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => handleDepartmentSelect(dept)}
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
