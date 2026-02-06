import { api } from '@/api/client';
import { MOCK_TIMETABLE_SUGGEST } from '@/mocks/api/timetableSuggest';
import { TimetableSuggestResponseSchema } from '@/schemas/timetableSuggestSchema';

export const USE_MOCK = true;

export const getTimetableSuggest = async (source: 'api' | 'mock' = USE_MOCK ? 'mock' : 'api') => {
  if (source === 'mock') {
    return TimetableSuggestResponseSchema.parse(MOCK_TIMETABLE_SUGGEST);
  }

  const response = await api.get('timetables/suggest', { timeout: false }).json();
  return TimetableSuggestResponseSchema.parse(response);
};
