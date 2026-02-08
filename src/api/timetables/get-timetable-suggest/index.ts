import { api } from '@/api/client';
import { TimetableSuggestResponseSchema } from '@/schemas/timetableSuggestSchema';

export const getTimetableSuggest = async () => {
  const response = await api.get('timetables/suggest', { timeout: false }).json();
  return TimetableSuggestResponseSchema.parse(response);
};
