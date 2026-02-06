import { createContext } from 'react';

import { SelectedTimetableContextValue } from '@/components/Providers/SelectedTimetableProvider/type';

export const SelectedTimetableContext = createContext<null | SelectedTimetableContextValue>(null);
