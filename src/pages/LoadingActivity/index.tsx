import { useFlow } from '@stackflow/react/future';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useRef } from 'react';

import { getSyncStatus } from '@/api/sso';
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
    refetchInterval: (query) => (query.state.data?.status === 'PROCESSING' ? 1000 : false),
  });

  useEffect(() => {
    if (!data || hasNavigatedRef.current) {
      return;
    }

    if (data.status === 'PROCESSING') {
      return;
    }

    if (data.status === 'COMPLETED') {
      hasNavigatedRef.current = true;
      setStudentInfo({
        grade: data.grade,
        semester: data.semester,
        schoolId: data.schoolId,
        department: data.department,
        subDepartment: data.subDepartment,
        teachTrainingCourse: data.teachTrainingCourse,
      });
      replace('onboarding', {});
      return;
    }

    moveToError(data.reason);
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
