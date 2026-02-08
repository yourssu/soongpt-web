import { api } from '@/api/client';
import { TimetableResponseSchema } from '@/schemas/timetableSchema';

export const getTimetableById = async (timetableId: number) => {
  const response = await api.get(`timetables/${timetableId}`, { timeout: false }).json();
  return TimetableResponseSchema.parse(response);
};
