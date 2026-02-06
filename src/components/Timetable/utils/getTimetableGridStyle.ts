import { SLOT_HEIGHT, TIME_COL_WIDTH } from '@/components/Timetable/type';

export const getGridTemplateCols = (length: number): string => {
  return `${TIME_COL_WIDTH}px repeat(${length}, 1fr)`;
};

export const getGridTemplateRows = (length: number): string => {
  const headerHeight = SLOT_HEIGHT * 6;
  return `${headerHeight}px repeat(${length}, ${SLOT_HEIGHT * 12}px)`;
};
