import { send } from '@stackflow/compat-await-push';
import { useActivity, useFlow } from '@stackflow/react/future';
import { Suspense } from 'react';
import { useInputState } from 'react-simplikit';

import { ActivityLayout } from '@/components/ActivityLayout';
import { BaseAppBar } from '@/components/AppBar/BaseAppBar';
import { useDelayedValue } from '@/hooks/useDelayedValue';
import { useStackflowInputAutoFocusEffect } from '@/hooks/useStackflowInputAutoFocusEffect';
import { CourseSearchResult } from '@/pages/CourseSearchActivity/components/CourseSearchResult';
import { CourseSelectionChangeActionPayload } from '@/pages/CourseSearchActivity/type';

export const CourseSearchActivity = () => {
  const { pop } = useFlow();
  const { id } = useActivity();

  const [searchKeyword, setSearchKeyword] = useInputState('');
  const debouncedSearchKeyword = useDelayedValue(searchKeyword);

  const autoFocusRef = useStackflowInputAutoFocusEffect();

  const onCourseSelectionChange = ({ course, type }: CourseSelectionChangeActionPayload) => {
    pop();
    send({
      activityId: id,
      data: {
        type,
        course,
      },
    });
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <BaseAppBar className="!gap-0.5">
            <div className="bg-bg-layerDefault flex w-full items-center rounded-full px-5 py-2">
              <input
                className="flex flex-1 pr-2 outline-none"
                onChange={setSearchKeyword}
                placeholder="과목명을 입력해주세요"
                ref={autoFocusRef}
                value={searchKeyword}
              />
            </div>
          </BaseAppBar>
        </ActivityLayout.Header>

        <ActivityLayout.Body className="!py-2">
          <Suspense>
            <CourseSearchResult
              onCourseSelectionChange={onCourseSelectionChange}
              searchKeyword={debouncedSearchKeyword}
            />
          </Suspense>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
