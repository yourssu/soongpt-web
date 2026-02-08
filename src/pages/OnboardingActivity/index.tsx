import { useFlow } from '@stackflow/react/future';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { PostHog } from '@/bootstrap/posthog';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ActivityActionButton } from '@/components/ActivityLayout/ActivityActionButton';
import { ActivityHeaderText } from '@/components/ActivityLayout/ActivityHeaderText';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import { FLOW_PROGRESS } from '@/stackflow/progress';
import {
  departmentValues,
  schoolIdValues,
  Semester,
  semesterValues,
  StudentGrade,
  StudentGradeValues,
  type StudentType,
} from '@/types/student';
import { assertNonNullish } from '@/utils/assertion';

export const OnboardingActivity = () => {
  const { studentInfo, setStudentInfo } = useStudentInfoContext();
  const { push } = useFlow();

  const [mainDeptDropdown, setMainDeptDropdown] = useState<string[]>([]);
  const [subDeptDropdown, setSubDeptDropdown] = useState<string[]>([]);

  const handleClickButton = () => {
    assertNonNullish(studentInfo.grade);
    assertNonNullish(studentInfo.schoolId);
    assertNonNullish(studentInfo.semester);
    assertNonNullish(studentInfo.department);
    assertNonNullish(studentInfo.teachTrainingCourse);

    const assertedStudentInfo = {
      ...studentInfo,
      grade: studentInfo.grade,
      schoolId: studentInfo.schoolId,
      semester: studentInfo.semester,
      department: studentInfo.department,
      subDepartment: studentInfo.subDepartment,
      teachTrainingCourse: studentInfo.teachTrainingCourse,
    } satisfies StudentType;

    Mixpanel.setUser(assertedStudentInfo);
    PostHog.setUser(assertedStudentInfo);
    Mixpanel.trackUserInformationClick();
    push('course_selection', { type: 'RETAKE' });
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={FLOW_PROGRESS.onboarding} />
          <ActivityHeaderText align="center" title="사용자 학적 정보" />
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="flex w-full flex-col gap-4 px-5">
            {/* 학년 */}
            <div>
              <label className="mb-1.5 block text-sm">학년</label>
              <div className="relative">
                <select
                  className={`w-full appearance-none rounded-xl bg-white px-4 py-3 text-lg font-semibold ${studentInfo.grade !== undefined ? 'text-brandPrimary' : 'text-neutralPlaceholder'}`}
                  onChange={(e) => {
                    setStudentInfo((prev) => ({
                      ...prev,
                      grade: Number(e.target.value) as StudentGrade,
                    }));
                  }}
                  value={studentInfo.grade ?? ''}
                >
                  <option disabled value="">
                    학년
                  </option>
                  {StudentGradeValues.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-neutral pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
              </div>
            </div>

            {/* 학기 */}
            <div>
              <label className="mb-1.5 block text-sm">학기</label>
              <div className="relative">
                <select
                  className={`w-full appearance-none rounded-xl bg-white px-4 py-3 text-lg font-semibold ${studentInfo.semester !== undefined ? 'text-brandPrimary' : 'text-neutralPlaceholder'}`}
                  onChange={(e) => {
                    setStudentInfo((prev) => ({
                      ...prev,
                      semester: Number(e.target.value) as Semester,
                    }));
                  }}
                  value={studentInfo.semester ?? ''}
                >
                  <option disabled value="">
                    학기
                  </option>
                  {semesterValues.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-neutral pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
              </div>
            </div>

            {/* 입학년도 */}
            <div>
              <label className="mb-1.5 block text-sm">입학년도</label>
              <div className="relative">
                <select
                  className={`w-full appearance-none rounded-xl bg-white px-4 py-3 text-lg font-semibold ${studentInfo.schoolId !== undefined ? 'text-brandPrimary' : 'text-neutralPlaceholder'}`}
                  onChange={(e) => {
                    setStudentInfo((prev) => ({
                      ...prev,
                      schoolId: Number(e.target.value),
                    }));
                  }}
                  value={studentInfo.schoolId ?? ''}
                >
                  <option disabled value="">
                    입학년도
                  </option>
                  {schoolIdValues.map((y) => (
                    <option key={y} value={y}>
                      20{y}
                    </option>
                  ))}
                </select>
                <ChevronDown className="text-neutral pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2" />
              </div>
            </div>

            {/* 학과(주전공) */}
            <div className="relative">
              <label className="mb-1.5 block text-sm">학과(주전공)</label>
              <input
                className={`focus-visible:outline-borderRing w-full rounded-xl bg-white px-4 py-3 text-lg font-semibold ${studentInfo.department ? 'text-brandPrimary' : 'text-neutralPlaceholder'}`}
                onBlur={() => setMainDeptDropdown([])}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setStudentInfo((prev) => ({ ...prev, department: val }));
                  setMainDeptDropdown(
                    val !== ''
                      ? departmentValues.filter((d) => d.toLowerCase().includes(val.toLowerCase()))
                      : [],
                  );
                }}
                placeholder="학과(주전공)"
                type="text"
                value={studentInfo.department}
              />
              {mainDeptDropdown.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                  {mainDeptDropdown.map((dept) => (
                    <li key={dept}>
                      <button
                        className="text-neutralSubtle flex w-full items-center rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100"
                        onMouseDown={() => {
                          setStudentInfo((prev) => ({ ...prev, department: dept }));
                          setMainDeptDropdown([]);
                        }}
                        type="button"
                      >
                        {dept}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 복수(부)전공 */}
            <div className="relative">
              <label className="mb-1.5 block text-sm">복수(부)전공</label>
              <input
                className={`focus-visible:outline-borderRing w-full rounded-xl bg-white px-4 py-3 text-lg font-semibold ${studentInfo.subDepartment ? 'text-brandPrimary' : 'text-neutralPlaceholder'}`}
                onBlur={() => setSubDeptDropdown([])}
                onChange={(e) => {
                  const val = e.target.value.trim();
                  setStudentInfo((prev) => ({ ...prev, subDepartment: val }));
                  setSubDeptDropdown(
                    val !== ''
                      ? departmentValues.filter((d) => d.toLowerCase().includes(val.toLowerCase()))
                      : [],
                  );
                }}
                placeholder="복수(부)전공"
                type="text"
                value={studentInfo.subDepartment}
              />
              {subDeptDropdown.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-44 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                  {subDeptDropdown.map((dept) => (
                    <li key={dept}>
                      <button
                        className="text-neutralSubtle flex w-full items-center rounded-xl px-4 py-2 text-lg font-semibold hover:bg-gray-100"
                        onMouseDown={() => {
                          setStudentInfo((prev) => ({ ...prev, subDepartment: dept }));
                          setSubDeptDropdown([]);
                        }}
                        type="button"
                      >
                        {dept}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 교직 이수 여부 */}
            <div>
              <label className="mb-1.5 block text-sm">교직 이수 여부</label>
              <button
                className="text-brandPrimary w-full rounded-xl bg-white px-4 py-3 text-left text-lg font-semibold"
                onClick={() =>
                  setStudentInfo((prev) => ({
                    ...prev,
                    teachTrainingCourse: !prev.teachTrainingCourse,
                  }))
                }
                type="button"
              >
                {studentInfo.teachTrainingCourse ? 'O' : 'X'}
              </button>
            </div>
          </div>
        </ActivityLayout.Body>

        <ActivityLayout.Footer>
          <ActivityActionButton onClick={handleClickButton} type="button">
            저장하기
          </ActivityActionButton>
        </ActivityLayout.Footer>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
