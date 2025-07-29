import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { tv } from 'tailwind-variants';

import { NumberInput } from '@/pages/DesiredCreditActivity/components/NumberInput';

type PreviousSemesterScoreType = '4.0미만' | '4.0이상';

const semesterScoreTypeButton = tv({
  base: 'bg-bg-layerDefault h-6 cursor-pointer rounded-full px-4 outline-0',
  variants: {
    active: {
      true: '',
      false: 'text-neutralPlaceholder',
    },
  },
});

export const PointCarryOverCalculator = () => {
  const [previousSemesterPoint, setPreviousSemesterPoint] = useState<number | undefined>(undefined);
  const [previousSemesterScoreType, setPreviousSemesterScoreType] =
    useState<PreviousSemesterScoreType>('4.0미만');

  const maxPointWithCarryOver = useMemo(() => {
    if (previousSemesterPoint === undefined) {
      return undefined;
    }

    const maxPoint = previousSemesterScoreType === '4.0미만' ? 19 : 22;
    const maxCarryOverPoint = Math.min(3, Math.max(0, 19 - previousSemesterPoint));

    return maxPoint + maxCarryOverPoint;
  }, [previousSemesterPoint, previousSemesterScoreType]);

  return (
    <div className="flex flex-col gap-1">
      <div>[이월학점 계산기]</div>
      <div className="flex items-center gap-1">
        <label>직전학기 수강신청 학점:</label>
        <NumberInput
          className="bg-bg-layerDefault h-6 w-[90px] rounded-full px-4 text-center outline-0"
          inputMode="numeric"
          max={22}
          min={0}
          onChange={setPreviousSemesterPoint}
          placeholder="학점 입력"
          value={previousSemesterPoint}
        />
      </div>
      <div className="flex items-center gap-1">
        <label>직전학기 평균 평점:</label>
        <button
          className={semesterScoreTypeButton({ active: previousSemesterScoreType === '4.0미만' })}
          onClick={() => setPreviousSemesterScoreType('4.0미만')}
        >
          4.0미만
        </button>
        <button
          className={semesterScoreTypeButton({ active: previousSemesterScoreType === '4.0이상' })}
          onClick={() => setPreviousSemesterScoreType('4.0이상')}
        >
          4.0이상
        </button>
      </div>
      <div className="flex items-center gap-1">
        <label>최대 수강 신청 학점 →</label>
        <div
          className={clsx(
            'bg-bg-layerDefault flex h-6 items-center rounded-full px-4 outline-0',
            maxPointWithCarryOver === undefined ? 'text-neutralPlaceholder' : 'text-brandSecondary',
          )}
        >
          {maxPointWithCarryOver === undefined
            ? '최대 수강신청 학점'
            : `${maxPointWithCarryOver}학점`}
        </div>
      </div>
    </div>
  );
};
