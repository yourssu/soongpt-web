import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const allDepartments = [
  '컴퓨터학부',
  '전자공학과',
  '기계공학과',
  '화학공학과',
  '생명공학과',
  '수학과',
  '물리학과',
  '화학과',
  '경영학과',
  '경제학과',
  '심리학과',
  '사회학과',
  '영어영문학과',
  '국어국문학과',
  '철학과',
];

interface DepartmentInputProps {
  initialValue: string | undefined;
  onNext: (department: string) => void;
}

const DepartmentInput = ({ onNext, initialValue }: DepartmentInputProps) => {
  const [department, setDepartment] = useState(initialValue);
  const [matchingDepartments, setMatchingDepartments] = useState<string[]>([]);
  const [showLabel, setShowLabel] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setDepartment(value);

    const matches = allDepartments.filter((dept) => value !== '' && dept.includes(value));
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
            className="bg-basic-light absolute z-10 mt-2 w-full rounded-xl border border-gray-200 shadow-sm"
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
