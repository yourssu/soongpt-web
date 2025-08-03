import { SLOT_HEIGHT } from '@/components/Timetable/type';

export const getGridTemplateCols = (length: number): string => {
  return `1fr repeat(${length}, 3fr)`;
};

export const getGridTemplateRows = (length: number): string => {
  const headerHeight = SLOT_HEIGHT * 6;
  return `${headerHeight}px repeat(${length}, ${SLOT_HEIGHT * 12}px)`;
};
