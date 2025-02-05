import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { departments } from '../data/departments';

interface DepartmentInputProps {
  initialValue: string | undefined;
  onNext: (department: string) => void;
}

const DepartmentInput = ({ onNext, initialValue }: DepartmentInputProps) => {
  const [department, setDepartment] = useState(initialValue);
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
      className="relative"
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
      <input
        type="text"
        value={department}
        onChange={handleInputChange}
        className="bg-basic-light text-primary focus-visible:ring-ring w-full rounded-xl px-4 py-3 text-lg font-semibold focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
        placeholder="학과"
      />
      <AnimatePresence>
        {matchingDepartments.length > 0 && (
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
            className="bg-basic-light absolute z-10 mt-2 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 shadow-sm"
          >
            {matchingDepartments.map((dept, index) => (
              <li key={index}>
                <button
                  type="button"
                  className="text-list flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100"
                  onClick={() => handleDepartmentSelect(dept)}
                >
                  {dept}
                  {department === dept && <Check className="size-4 text-green-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DepartmentInput;
