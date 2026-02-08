import { SyncStatusType } from '@/api/sso/get-sync-status/response';

const MOCK_SYNC_STATUS_PROCESSING: SyncStatusType = {
  status: 'PROCESSING',
};

const MOCK_SYNC_STATUS_COMPLETED: SyncStatusType = {
  status: 'COMPLETED',
  grade: 2,
  semester: 1,
  schoolId: 24,
  department: '소프트웨어학부',
  subDepartment: '',
  teachTrainingCourse: false,
};

const MOCK_SYNC_STATUS_REQUIRES_REAUTH: SyncStatusType = {
  status: 'REQUIRES_REAUTH',
  reason: '유세인트 인증이 만료되었어요. 다시 로그인해주세요.',
};

const MOCK_SYNC_STATUS_FAILED: SyncStatusType = {
  status: 'FAILED',
  reason: '유세인트 동기화에 실패했어요. 잠시 후 다시 시도해주세요.',
};

export const MOCK_SYNC_STATUS_FAILED_NO_SESSION: SyncStatusType = {
  status: 'FAILED',
  reason: '동기화 세션이 없어요. 다시 로그인해주세요.',
};

let syncStatusPollCount = 0;

export const getNextMockSyncStatus = (): SyncStatusType => {
  syncStatusPollCount += 1;

  if (syncStatusPollCount <= 2) {
    return MOCK_SYNC_STATUS_PROCESSING;
  }

  return MOCK_SYNC_STATUS_COMPLETED;
};

export const getMockSyncStatusFromQuery = (mockStatus: null | string): null | SyncStatusType => {
  if (!mockStatus) {
    return null;
  }

  switch (mockStatus.toUpperCase()) {
    case 'COMPLETED':
      return MOCK_SYNC_STATUS_COMPLETED;
    case 'FAILED':
      return MOCK_SYNC_STATUS_FAILED;
    case 'NO_SESSION':
      return MOCK_SYNC_STATUS_FAILED_NO_SESSION;
    case 'PROCESSING':
      return MOCK_SYNC_STATUS_PROCESSING;
    case 'REQUIRES_REAUTH':
      return MOCK_SYNC_STATUS_REQUIRES_REAUTH;
    default:
      return null;
  }
};
