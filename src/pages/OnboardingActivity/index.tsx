import { motion } from 'motion/react';
import { useMemo, useRef } from 'react';

import { Mixpanel } from '@/bootstrap/mixpanel';
import { ActivityLayout } from '@/components/ActivityLayout';
import { ProgressAppBar } from '@/components/AppBar/ProgressAppBar';
import { useStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';
import ChapelInput from '@/pages/OnboardingActivity/components/ChapelInput';
import DepartmentInput from '@/pages/OnboardingActivity/components/DepartmentInput';
import GradeInput from '@/pages/OnboardingActivity/components/GradeInput';
import SchoolIdInput from '@/pages/OnboardingActivity/components/SchoolIdInput';
import { useFlow } from '@/stackflow';
import { assertNonNullish } from '@/utils/assertion';
import { ActivityComponentType } from '@/utils/stackflow';

export const OnboardingActivity: ActivityComponentType = () => {
  const { studentInfo, setStudentInfo } = useStudentInfoContext();

  const { push } = useFlow();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const step = useMemo(() => {
    // 학과입력 -> 학번입력 -> 학년입력 -> 완료(채플수강여부입력)
    if (studentInfo.department === '') {
      return '학과입력' as const;
    }
    if (!studentInfo.schoolId) {
      return '학번입력' as const;
    }
    if (!studentInfo.grade) {
      return '학년입력' as const;
    }
    return '완료' as const;
  }, [studentInfo]);

  const handleClickButton = () => {
    assertNonNullish(studentInfo.grade);
    assertNonNullish(studentInfo.schoolId);

    const assertedStudentInfo = {
      ...studentInfo,
      grade: studentInfo.grade,
      schoolId: studentInfo.schoolId,
    };

    Mixpanel.setUser(assertedStudentInfo);
    Mixpanel.trackUserInformationClick();
    push('CourseSelectionActivity', { type: 'MAJOR_REQUIRED' });
  };

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Header>
          <ProgressAppBar progress={25} />
          <div className="mt-6 flex w-full flex-col items-center">
            <div className="text-center text-[28px]/[normal] font-semibold break-keep">
              사용자님에 대해 알려주세요!
            </div>
            <span className="mt-1 font-light">시간표를 만들기 위한 최소한의 정보가 필요해요.</span>
          </div>
        </ActivityLayout.Header>

        <ActivityLayout.Body>
          <div className="flex w-full flex-[1_1_0] flex-col gap-6 py-2">
            {step === '완료' &&
              (() => {
                assertNonNullish(studentInfo.grade);
                return (
                  <ChapelInput
                    grade={studentInfo.grade}
                    initialValue={studentInfo.isChapel}
                    onNext={(chapel) => setStudentInfo({ ...studentInfo, isChapel: chapel })}
                  />
                );
              })()}

            {(step === '학년입력' || step === '완료') && (
              <GradeInput
                initialValue={studentInfo.grade}
                onNext={(grade) => {
                  setStudentInfo({ ...studentInfo, grade });
                }}
              />
            )}

            {(step === '학번입력' || step === '학년입력' || step === '완료') && (
              <SchoolIdInput
                initialValue={studentInfo.schoolId}
                onNext={(schoolId) => setStudentInfo({ ...studentInfo, schoolId })}
              />
            )}

            {(step === '학과입력' ||
              step === '학번입력' ||
              step === '학년입력' ||
              step === '완료') && (
              <DepartmentInput
                initialValue={studentInfo.department}
                onNext={(department) => setStudentInfo({ ...studentInfo, department })}
              />
            )}
          </div>
        </ActivityLayout.Body>

        {step === '완료' && (
          <ActivityLayout.Footer>
            <motion.button
              animate={{ opacity: 1, y: 0 }}
              className="bg-brandPrimary w-full rounded-2xl py-3.5 font-semibold text-white"
              initial={{
                opacity: 0,
                y: 20,
              }}
              onClick={handleClickButton}
              ref={submitButtonRef}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
              }}
              type="button"
            >
              입력 완료
            </motion.button>
          </ActivityLayout.Footer>
        )}
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
