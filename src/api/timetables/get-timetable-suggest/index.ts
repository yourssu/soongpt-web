import { api } from '@/api/client';
import { TimetableSuggestResponseSchema } from '@/api/timetables/get-timetable-suggest/response';

export const getTimetableSuggest = async () => {
  const response = await api.get('timetables/suggest', { timeout: false }).json();
  return TimetableSuggestResponseSchema.parse(response);
};
