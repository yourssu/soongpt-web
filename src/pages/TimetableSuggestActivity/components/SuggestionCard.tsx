import { RecommendationDtoType } from '@/schemas/timetableRecommendationSchema';
import { cn } from '@/utils/dom';

interface SuggestionCardProps {
  index: number;
  isSelected: boolean;
  item: RecommendationDtoType;
  onClick: () => void;
}

export const SuggestionCard = ({ item, isSelected, onClick, index }: SuggestionCardProps) => {
  return (
    <button
      className={cn(
        'flex w-full flex-col gap-2 rounded-[20px] border p-4 text-left',
        isSelected
          ? 'border-brandPrimary text-brandPrimary bg-white'
          : 'border-transparent bg-white',
      )}
      onClick={onClick}
      type="button"
    >
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-[24px] font-semibold">
          {index}. {item.description}
        </p>
        <p
          className={cn(
            'text-[12px] leading-[24px]',
            isSelected ? 'text-brandPrimary' : 'text-neutral',
          )}
        >
          추천 시간표로 변경할까요?
        </p>
      </div>
    </button>
  );
};
