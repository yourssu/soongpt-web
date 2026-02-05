export type StudentType = {
  department: string;
  grade: StudentGrade;
  schoolId: number;
  semester: Semester;
  subDepartment: string | undefined;
  teachTrainingCourse: boolean;
};

export const StudentGrade = [1, 2, 3, 4, 5] as const;
export type StudentGrade = (typeof StudentGrade)[number];

export const semesters = [1, 2] as const;
export type Semester = (typeof semesters)[number];

export const schoolIds = [26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15] as const;

export const departments = [
  '차세대반도체학과',
  'AI융합학부',
  '글로벌미디어학부',
  '미디어경영학과',
  '소프트웨어학부',
  '전자정보공학부 IT융합전공',
  '전자정보공학부 전자공학전공',
  '정보보호학과',
  '컴퓨터학부',
  '경영학부',
  '금융학부',
  '벤처경영학과',
  '벤처중소기업학과',
  '복지경영학과',
  '혁신경영학과',
  '회계세무학과',
  '회계학과',
  '경제학과',
  '국제무역학과',
  '글로벌통상학과',
  '금융경제학과',
  '통상산업학과',
  '건축학부 건축공학전공',
  '건축학부 건축학부',
  '건축학부 건축학전공',
  '건축학부 실내건축전공',
  '기계공학부',
  '산업정보시스템공학과',
  '신소재공학과',
  '전기공학부',
  '화학공학과',
  '국제법무학과',
  '법학과',
  '자유전공학부',
  '사회복지학부',
  '언론홍보학과',
  '정보사회학과',
  '정치외교학과',
  '평생교육학과',
  '행정학부',
  '국어국문학과',
  '기독교학과',
  '독어독문학과',
  '불어불문학과',
  '사학과',
  '스포츠학부',
  '영어영문학과',
  '예술창작학부 문예창작전공',
  '예술창작학부 영화예술전공',
  '일어일문학과',
  '중어중문학과',
  '철학과',
  '물리학과',
  '수학과',
  '의생명시스템학부',
  '정보통계보험수리학과',
  '화학과',
] as const;
