import { TimetableSuggestItemType } from '@/schemas/timetableSuggestSchema';
import { cn } from '@/utils/dom';

interface SuggestionCardProps {
  isSelected: (actionKey: string) => boolean;
  item: TimetableSuggestItemType;
  onActionClick: (actionKey: string) => void;
}

export const SuggestionCard = ({ item, isSelected, onActionClick }: SuggestionCardProps) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-[20px] bg-white p-4">
      <div className="flex flex-col gap-1">
        <p className="text-[16px] leading-[24px] font-semibold">{item.title}</p>
        <p className="text-neutralSubtle text-[12px] leading-[18px]">{item.description}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {item.actions.map((action, index) => {
          const actionKey = `${item.id}:${index}`;
          const selected = isSelected(actionKey);
          return (
            <button
              className={cn(
                'h-8 flex-1 rounded-[10px] px-2 text-[12px] font-medium',
                selected
                  ? 'bg-bg-brandLayerLight text-brandSecondary'
                  : 'bg-bg-buttonDisabled text-neutral',
              )}
              key={actionKey}
              onClick={() => onActionClick(actionKey)}
              type="button"
            >
              {action.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
