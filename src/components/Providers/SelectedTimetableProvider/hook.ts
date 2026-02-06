import { useContext } from 'react';

import { SelectedTimetableContext } from '@/components/Providers/SelectedTimetableProvider/context';

export const useSelectedTimetableContext = () => {
  const context = useContext(SelectedTimetableContext);

  if (!context) {
    throw new Error(
      'useSelectedTimetableContext는 SelectedTimetableContext.Provider 하위에서 사용해주세요.',
    );
  }

  return context;
};
