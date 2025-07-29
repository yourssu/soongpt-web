import { SelectableChip } from '@/components/Chip/SelectableChip';
import { Grade } from '@/schemas/studentSchema';

interface GradeChipProps {
  grades: Grade[];
  isSelected: boolean;
  onClickGradeChip: () => void;
}

const GradeChip = ({ isSelected, grades, onClickGradeChip }: GradeChipProps) => {
  return (
    <SelectableChip onSelectChange={onClickGradeChip} selected={isSelected}>
      {grades.join(',')}학년
    </SelectableChip>
  );
};
export default GradeChip;
