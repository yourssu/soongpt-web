export const timetableTags = [
  '기본 태그',
  '아침 수업이 없는 시간표',
  '공강 날이 있는 시간표',
  '우주 공강이 없는 시간표',
  '점심시간 보장되는 시간표',
  '저녁수업이 없는 시간표',
] as const;
export type TimetableTagType = (typeof timetableTags)[number];
