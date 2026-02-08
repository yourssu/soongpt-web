import { CourseType } from '@/types/course';
import { StudentType } from '@/types/student';
import { TimetableType } from '@/types/timetable';
import { TimetablePartialSelectionPayloadType } from '@/types/timetablePayload';

const dedupeCodes = (codes: number[]) => Array.from(new Set(codes));

const categoryToCodes = (courses: Pick<CourseType, 'category' | 'code'>[]) => {
  const majorRequiredCodes = courses
    .filter((course) => course.category === 'MAJOR_REQUIRED')
    .map((course) => course.code);
  const majorElectiveCodes = courses
    .filter((course) => course.category === 'MAJOR_ELECTIVE')
    .map((course) => course.code);
  const generalRequiredCodes = courses
    .filter((course) => course.category === 'GENERAL_REQUIRED')
    .map((course) => course.code);
  const selectedGeneralElectiveCodes = courses
    .filter((course) => course.category === 'GENERAL_ELECTIVE')
    .map((course) => course.code);
  const selectedChapelCode = courses.find((course) => course.category === 'CHAPEL')?.code;

  const knownCodes = new Set([
    ...(selectedChapelCode ? [selectedChapelCode] : []),
    ...generalRequiredCodes,
    ...majorElectiveCodes,
    ...majorRequiredCodes,
    ...selectedGeneralElectiveCodes,
  ]);

  const codes = courses
    .filter((course) => !knownCodes.has(course.code))
    .map((course) => course.code);

  return {
    majorRequiredCodes: dedupeCodes(majorRequiredCodes),
    majorElectiveCodes: dedupeCodes(majorElectiveCodes),
    generalRequiredCodes: dedupeCodes(generalRequiredCodes),
    selectedGeneralElectiveCodes: dedupeCodes(selectedGeneralElectiveCodes),
    selectedChapelCode,
    codes: dedupeCodes(codes),
  };
};

const pickStudentInfo = (
  source: Pick<
    TimetablePartialSelectionPayloadType,
    | 'department'
    | 'doubleMajorDepartment'
    | 'grade'
    | 'minorDepartment'
    | 'schoolId'
    | 'semester'
    | 'teachTrainingCourse'
  >,
): StudentType => {
  return {
    department: source.department,
    doubleMajorDepartment: source.doubleMajorDepartment,
    grade: source.grade,
    minorDepartment: source.minorDepartment,
    schoolId: source.schoolId,
    semester: source.semester,
    teachTrainingCourse: source.teachTrainingCourse,
  };
};

export const buildPartialSelectionFromCourses = (
  studentInfo: StudentType,
  courses: Pick<CourseType, 'category' | 'code'>[],
): TimetablePartialSelectionPayloadType => {
  const categorized = categoryToCodes(courses);

  return {
    ...studentInfo,
    codes: categorized.codes,
    generalRequiredCodes: categorized.generalRequiredCodes,
    majorElectiveCodes: categorized.majorElectiveCodes,
    majorRequiredCodes: categorized.majorRequiredCodes,
    generalElectivePoint: 0,
    preferredGeneralElectives: [],
    selectedGeneralElectiveCodes: categorized.selectedGeneralElectiveCodes,
    selectedChapelCode: categorized.selectedChapelCode,
  };
};

export const buildPartialSelectionFromTimetable = (
  previousSelection: TimetablePartialSelectionPayloadType,
  timetable: TimetableType,
  options?: {
    selectedChapelCode?: number;
    selectedGeneralElectiveCodes?: number[];
  },
): TimetablePartialSelectionPayloadType => {
  const categorized = categoryToCodes(timetable.courses);
  const studentInfo = pickStudentInfo(previousSelection);

  return {
    ...studentInfo,
    codes: categorized.codes,
    generalRequiredCodes: categorized.generalRequiredCodes,
    majorElectiveCodes: categorized.majorElectiveCodes,
    majorRequiredCodes: categorized.majorRequiredCodes,
    generalElectivePoint: previousSelection.generalElectivePoint,
    preferredGeneralElectives: previousSelection.preferredGeneralElectives,
    selectedGeneralElectiveCodes:
      options?.selectedGeneralElectiveCodes ?? categorized.selectedGeneralElectiveCodes,
    selectedChapelCode: options?.selectedChapelCode ?? categorized.selectedChapelCode,
  };
};

export const removeCodeFromPartialSelection = (
  selection: TimetablePartialSelectionPayloadType,
  code: number,
): TimetablePartialSelectionPayloadType => {
  return {
    ...selection,
    codes: selection.codes.filter((value) => value !== code),
    generalRequiredCodes: selection.generalRequiredCodes.filter((value) => value !== code),
    majorElectiveCodes: selection.majorElectiveCodes.filter((value) => value !== code),
    majorRequiredCodes: selection.majorRequiredCodes.filter((value) => value !== code),
    selectedGeneralElectiveCodes: selection.selectedGeneralElectiveCodes.filter(
      (value) => value !== code,
    ),
    selectedChapelCode:
      selection.selectedChapelCode === code ? undefined : selection.selectedChapelCode,
  };
};
