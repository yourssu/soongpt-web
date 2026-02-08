import { z } from 'zod/v4';

export const generalElectiveFieldsAfter23Values = [
  '인간・언어',
  '문화・예술',
  '사회・정치・경제',
  '과학・기술',
  'Bridge 교과',
  '자기개발・진로탐색',
] as const;

export const GENERAL_ELECTIVE_FIELDS_AFTER_23 = z.literal(generalElectiveFieldsAfter23Values);
export type GeneralElectiveFieldAfter23 = z.infer<typeof GENERAL_ELECTIVE_FIELDS_AFTER_23>;

export const generalElectiveFieldsBefore22Values = [
  '인성과 리더십',
  '자기계발과 진로탐색',
  '한국어의사소통',
  '국제어문',
  '자연과학・공학・기술',
  '역사・철학・종교',
  '정치・경제・경영',
  '사회・문화・심리',
  '문학・예술',
] as const;

export const GENERAL_ELECTIVE_FIELDS_BEFORE_22 = z.literal(generalElectiveFieldsBefore22Values);
export type GeneralElectiveFieldBefore22 = z.infer<typeof GENERAL_ELECTIVE_FIELDS_BEFORE_22>;
