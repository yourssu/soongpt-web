import { useFlow } from '@stackflow/react/future';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

import { getSyncStatus } from '@/api/sso/get-sync-status';
import { ActivityLayout } from '@/components/ActivityLayout';
import { useStudentInfoContext } from '@/components/Providers/StudentInfoProvider/hook';

export const LoadingActivity = () => {
  const { replace } = useFlow();
  const { setStudentInfo } = useStudentInfoContext();
  const hasNavigatedRef = useRef(false); // 중복 화면 이동 방지

  const moveToError = useCallback(
    (reason?: string) => {
      if (hasNavigatedRef.current) {
        return;
      }

      hasNavigatedRef.current = true;
      replace('error', {
        message: reason?.trim()
          ? reason
          : '동기화 상태를 확인하지 못했어요. 잠시 후 다시 시도해주세요.',
      });
    },
    [replace],
  );

  const { data, error } = useQuery({
    queryKey: ['sync-status'],
    queryFn: getSyncStatus,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: (query) => (query.state.data?.result.status === 'PROCESSING' ? 1000 : false),
  });

  useEffect(() => {
    if (!data || hasNavigatedRef.current) {
      return;
    }

    if (data.result.status === 'PROCESSING') {
      return;
    }

    if (data.result.status === 'COMPLETED') {
      const completedStudentInfo = data.result.studentInfo;
      hasNavigatedRef.current = true;
      setStudentInfo({
        department: completedStudentInfo.department,
        doubleMajorDepartment: completedStudentInfo.doubleMajorDepartment ?? '',
        grade: completedStudentInfo.grade,
        minorDepartment: completedStudentInfo.minorDepartment ?? '',
        schoolId: completedStudentInfo.year % 100,
        semester: completedStudentInfo.semester % 2 === 0 ? 2 : 1,
        teachTrainingCourse: completedStudentInfo.teaching,
      });
      replace('onboarding', {});
      return;
    }

    if (data.result.status === 'REQUIRES_REAUTH' || data.result.status === 'ERROR') {
      hasNavigatedRef.current = true;
      replace('retry_login', {});
      return;
    }

    moveToError(data.result.reason ?? undefined);
  }, [data, moveToError, replace, setStudentInfo]);

  useEffect(() => {
    if (!error) {
      return;
    }

    moveToError();
  }, [error, moveToError]);

  return (
    <ActivityLayout>
      <ActivityLayout.ScrollArea>
        <ActivityLayout.Body variant="centered">
          <div className="text-brandPrimary text-2xl font-semibold">로그인 처리 중</div>
          <div className="text-neutralTextSecondary text-center text-lg font-medium whitespace-pre-line">
            유세인트 정보를 얻어오고 있어요.
            {'\n'}
            기다려주세요.
          </div>
        </ActivityLayout.Body>
      </ActivityLayout.ScrollArea>
    </ActivityLayout>
  );
};
