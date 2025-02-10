import { Grade } from '../schemas/studentSchema.ts';

interface GradeChipProps {
  isSelected: boolean;
  grades: Grade[];
  onClickGradeChip: () => void;
}

const GradeChip = ({ isSelected, grades, onClickGradeChip }: GradeChipProps) => {
  return (
    <span
      onClick={onClickGradeChip}
      className={`cursor-pointer transition-colors ${isSelected ? 'text-primary' : 'text-basic-secondary'} ${isSelected ? 'bg-chip-selected' : 'bg-chip-unselected'} flex place-items-center rounded-[40px] px-3 py-0.5 text-sm ${isSelected ? 'font-semibold' : 'font-normal'}`}
    >
      {grades.join(',')}학년
    </span>
  );
};
export default GradeChip;
