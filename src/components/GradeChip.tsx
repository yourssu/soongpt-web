interface GradeChipProps {
  isSelected: boolean;
  grade: string;
  onClickGradeChip: () => void;
}

const GradeChip = ({ isSelected, grade, onClickGradeChip }: GradeChipProps) => {
  return (
    <span
      onClick={onClickGradeChip}
      className={`cursor-pointer transition-colors ${isSelected ? 'text-primary' : 'text-basic-secondary'} ${isSelected ? 'bg-chip-selected' : 'bg-chip-unselected'} flex place-items-center rounded-[40px] px-3 py-0.5 text-sm ${isSelected ? 'font-semibold' : 'font-normal'}`}
    >
      {grade}
    </span>
  );
};
export default GradeChip;
