import { tv } from 'tailwind-variants';

import { useAssertedStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

interface PreferedGeneralElectivesChipGroupProps {
  onChange: (selectedChips: string[]) => void;
  values: string[];
}

const chip = tv({
  base: 'rounded-full border px-3 py-1 text-xs',
  variants: {
    selected: {
      true: 'border-brandPrimary text-brandPrimary',
      false: 'border-neutralPlaceholder',
    },
  },
});

export const PreferedGeneralElectivesChipGroup = ({
  values,
  onChange,
}: PreferedGeneralElectivesChipGroupProps) => {
  const { schoolId } = useAssertedStudentInfoContext();
  const chipValueType = schoolId >= 23 ? '23학번_이상' : '그외';
  const chipValues = chipContentValues[chipValueType];

  const parseToUsableChipValue = (chipValue: string) => {
    return chipValue.replace(/\s+/g, ' ');
  };

  return (
    <div className="flex flex-wrap justify-center gap-x-1 gap-y-2">
      {chipValues.map((rawChipValue) => {
        const comparableChipValue = parseToUsableChipValue(rawChipValue);
        const isSelected = values.includes(comparableChipValue);
        return (
          <button
            className={chip({ selected: isSelected })}
            key={rawChipValue}
            onClick={() => {
              if (isSelected) {
                onChange(values.filter((v) => v !== comparableChipValue));
              } else {
                onChange([...values, comparableChipValue]);
              }
            }}
          >
            {rawChipValue}
          </button>
        );
      })}
    </div>
  );
};

const chipContentValues = {
  '23학번_이상': [
    '인간 · 언어',
    '문화 · 예술',
    '사회 · 정치 · 경제',
    '과학 · 기술',
    'Bridge 교과',
    '자기개발 · 진로탐색',
  ],
  그외: [
    '한국어의사소통',
    '국제어문',
    '인성과 리더십',
    '자기계발과 진로탐색',
    '사회 · 문화 · 심리',
    '역사 · 철학 · 종교',
    '정치 · 경제 · 경영',
    '문학 · 예술',
    '자연과학 · 공학 · 기술',
  ],
};
