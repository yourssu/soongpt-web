import { Check } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

const allDepartments = [
  'AI융합학부',
  '건축학부 건축공학전공',
  '건축학부 건축학부',
  '건축학부 건축학전공',
  '건축학부 실내건축전공',
  '경영학부',
  '국어국문학과',
  '국제무역학과',
  '국제법무학과',
  '금융경제학과',
  '금융학부',
  '기계공학부',
  '기독교학과',
  '글로벌미디어학부',
  '글로벌통상학과',
  '독어독문학과',
  '물리학과',
  '미디어경영학과',
  '법학과',
  '벤처경영학과',
  '벤처중소기업학과',
  '복지경영학과',
  '불어불문학과',
  '사학과',
  '사회복지학부',
  '산업정보시스템공학과',
  '소프트웨어학부',
  '수학과',
  '스포츠학부',
  '신소재공학과',
  '영어영문학과',
  '예술창작학부 문예창작전공',
  '예술창작학부 영화예술전공',
  '언론홍보학과',
  '의생명시스템학부',
  '자유전공학부',
  '전기공학부',
  '전자정보공학부 IT융합전공',
  '전자정보공학부 전자공학전공',
  '정보보호학과',
  '정보사회학과',
  '정보통계보험수리학과',
  '정치외교학과',
  '철학과',
  '차세대반도체학과',
  '컴퓨터학부',
  '통상산업학과',
  '평생교육학과',
  '한문학과',
  '화학과',
  '화학공학과',
  '혁신경영학과',
  '행정학부',
  '회계세무학과',
  '회계학과',
] as const;

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
