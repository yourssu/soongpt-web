import * as Popover from '@radix-ui/react-popover';
import { Check, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import Hint from '@/components/Hint';
import { useAlertDialog } from '@/hooks/useAlertDialog';
import { Grade } from '@/schemas/studentSchema';
import { grades } from '@/types/grades';

interface GradeInputProps {
  initialValue: Grade | undefined;
  onNext: (grade: Grade) => void;
}

const GradeInput = ({ onNext, initialValue }: GradeInputProps) => {
  const [grade, setGrade] = useState(initialValue);
  const [showLabel, setShowLabel] = useState(initialValue !== 0);
  const [showDropdown, setShowDropdown] = useState(false);

  const openScheduleInfoDialog = useAlertDialog();

  const handleGradeSelect = (grade: Grade) => {
    setGrade(grade);
    setShowDropdown(false);

    // 라벨 보이기
    setShowLabel(true);
    // 다음 단계로 넘어가기
    onNext(grade);
  };

  const handleClickScheduleInfo = async () => {
    if (grade === undefined || grade === 0) {
      return;
    }

    const rawSchedule = courseResigtrationScheduleMap[grade];

    openScheduleInfoDialog({
      title: `${grade}학년 수강신청 일정`,
      content: (
        <>
          <div>[{grade}학년 수강신청 기간]</div>
          <div className="text-brandSecondary">{rawSchedule}</div>
          <div>과목의 수강대상과 본인이 일치해야 신청 가능</div>
          <br />
          <div>[전체 수강신청 기간]</div>
          <div className="text-brandSecondary">{courseResigtrationScheduleMap.common}</div>
          <div>여석이 있는 모든 과목 신청 가능</div>
          <br />
          <div>*특정 학과를 제한하거나, 대상외 수강제한을 정한 과목은 불가능</div>
        </>
      ),
      closeableWithOutside: true,
      closeButton: true,
    });
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
      {showLabel && <label className="mb-1.5 block text-sm">학년</label>}

      <Popover.Root onOpenChange={setShowDropdown} open={showDropdown}>
        <Popover.Trigger asChild>
          <button
            className={`bg-bg-layerDefault focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-3 text-lg font-semibold ${grade === 0 ? 'text-neutralPlaceholder' : 'text-brandPrimary'}`}
            type="button"
          >
            {grade === 0 ? '학년' : grade}
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
                className="bg-bg-layerDefault z-10 w-[var(--radix-popover-trigger-width)] rounded-xl border border-gray-200 shadow-sm"
                exit={{
                  opacity: 0,
                  y: -10,
                }}
                initial={{ opacity: 0, y: -10 }}
                transition={{
                  duration: 0.2,
                }}
              >
                {grades.map((gradeOption) => (
                  <li key={gradeOption}>
                    <button
                      className="text-neutralSubtle focus-visible:outline-borderRing flex w-full items-center justify-between rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100 focus-visible:-outline-offset-1"
                      onClick={() => {
                        handleGradeSelect(gradeOption);
                      }}
                      type="button"
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

      <Hint className="mt-2">
        <Hint.Icon />
        <Hint.Text>이번 학기에 이수 예정인 학년을 선택해주세요.</Hint.Text>
      </Hint>

      <button
        className="text-brandPrimary cursor-pointer text-xs underline"
        onClick={handleClickScheduleInfo}
      >
        주요 수강신청 일정 안내
      </button>
    </motion.div>
  );
};

const courseResigtrationScheduleMap = {
  [1]: '8/4(월) 10:00~15:00',
  [2]: '8/5(화) 10:00~15:00',
  [3]: '8/6(수) 10:00~15:00',
  [4]: '8/7(목) 10:00~15:00',
  [5]: '8/8(금) 10:00~15:00',
  common: '8/8(금) 10:00~15:00',
};

export default GradeInput;
