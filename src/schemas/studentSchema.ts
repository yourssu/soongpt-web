import { z } from 'zod';

const Grade = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const studentSchema = z.object({
  schoolId: z.number().int().min(15).max(25).describe('입학년도'),

  department: z.string().describe('학과명'),

  grade: Grade.describe('학년'),

  isChapel: z.boolean().describe('채플 수강 여부'),
});

export const coursePreferenceSchema = z.object({
  codes: z.array(z.number()).describe('모든 과목 목록'),
  majorRequiredCodes: z.array(z.number()).describe('전공필수 과목 목록'),
  majorElectiveCodes: z.array(z.number()).describe('전공선택 과목 목록'),
  generalRequiredCodes: z.array(z.number()).describe('교양필수 과목 목록'),
  generalElectivePoint: z.number().int().nonnegative().describe('희망 전공선택 학점'),
  preferredGeneralElectives: z.array(z.string()).describe('희망 교양 과목 목록'),
});

export const studentTimetableSchema = studentSchema.merge(coursePreferenceSchema);

export type Grade = z.infer<typeof Grade>;
export type Student = z.infer<typeof studentSchema>;
export type StudentWithoutChapel = Omit<Student, 'isChapel'>;
export type StudentTimetable = z.infer<typeof studentTimetableSchema>;
