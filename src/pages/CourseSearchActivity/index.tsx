import { ActivityLayout } from '@/components/ActivityLayout';
import { BaseAppBar } from '@/components/AppBar/BaseAppBar';
import { IcMonoSearch } from '@/components/Icons/IcMonoSearch';
import { useStackflowInputAutoFocusEffect } from '@/pages/CourseSearchActivity/hooks/useStackflowInputAutoFocusEffect';

export const CourseSearchActivity = () => {
  const inputRef = useStackflowInputAutoFocusEffect();

  return (
    <ActivityLayout>
      <BaseAppBar className="!gap-0.5">
        <div className="bg-bg-layerDefault flex w-full items-center rounded-full px-5 py-2">
          <input
            className="flex flex-1 pr-2 text-xs outline-none"
            placeholder="과목명을 입력해주세요"
            ref={inputRef}
          />
          <IcMonoSearch className="text-neutralPlaceholder" size={20} />
        </div>
      </BaseAppBar>
    </ActivityLayout>
  );
};
