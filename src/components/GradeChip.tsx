import { Grade } from '../schemas/studentSchema.ts';

interface GradeChipProps {
  grades: Grade[];
  isSelected: boolean;
  onClickGradeChip: () => void;
}

const GradeChip = ({ isSelected, grades, onClickGradeChip }: GradeChipProps) => {
  return (
    <span
      className={`cursor-pointer transition-colors ${isSelected ? 'text-primary' : 'text-basic-secondary'} ${isSelected ? 'bg-chip-selected' : 'bg-chip-unselected'} flex place-items-center rounded-[40px] px-3 py-0.5 text-sm ${isSelected ? 'font-semibold' : 'font-normal'}`}
      onClick={onClickGradeChip}
    >
      {grades.join(',')}학년
    </span>
  );
};
export default GradeChip;
