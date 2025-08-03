import { SelectableChip } from '@/components/Chip/SelectableChip';
import { StudentGrade } from '@/types/student';

interface GradeChipProps {
  grades: StudentGrade[];
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
