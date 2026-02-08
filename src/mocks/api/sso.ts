import { SyncStatusType } from '@/api/sso/get-sync-status/response';
import { PutStudentInfoRequestType } from '@/api/sso/put-student-info/request';
import { PutStudentInfoResponseType } from '@/api/sso/put-student-info/response';

type MockApiResponse<T> = {
  response: T;
  status: number;
};

const MOCK_TIMESTAMP = '2026-02-08 12:00:00';

const MOCK_SYNC_STATUS_PROCESSING: SyncStatusType = {
  result: {
    reason: null,
    status: 'PROCESSING',
    studentInfo: null,
  },
  timestamp: MOCK_TIMESTAMP,
};

const MOCK_SYNC_STATUS_COMPLETED: SyncStatusType = {
  result: {
    reason: null,
    status: 'COMPLETED',
    studentInfo: {
      department: '소프트웨어학부',
      doubleMajorDepartment: null,
      grade: 2,
      minorDepartment: null,
      semester: 1,
      teaching: false,
      year: 2024,
    },
  },
  timestamp: MOCK_TIMESTAMP,
};

const MOCK_SYNC_STATUS_REQUIRES_REAUTH: SyncStatusType = {
  result: {
    reason: 'token_expired',
    status: 'REQUIRES_REAUTH',
    studentInfo: null,
  },
  timestamp: MOCK_TIMESTAMP,
};

const MOCK_SYNC_STATUS_FAILED: SyncStatusType = {
  result: {
    reason: 'sync_failed',
    status: 'FAILED',
    studentInfo: null,
  },
  timestamp: MOCK_TIMESTAMP,
};

const MOCK_SYNC_STATUS_INVALID_SESSION: SyncStatusType = {
  result: {
    reason: 'invalid_session',
    status: 'ERROR',
    studentInfo: null,
  },
  timestamp: MOCK_TIMESTAMP,
};

const MOCK_SYNC_STATUS_SESSION_EXPIRED: SyncStatusType = {
  result: {
    reason: 'session_expired',
    status: 'ERROR',
    studentInfo: null,
  },
  timestamp: MOCK_TIMESTAMP,
};

let syncStatusPollCount = 0;

export const getNextMockSyncStatus = (): MockApiResponse<SyncStatusType> => {
  syncStatusPollCount += 1;

  if (syncStatusPollCount <= 2) {
    return { response: MOCK_SYNC_STATUS_PROCESSING, status: 200 };
  }

  return { response: MOCK_SYNC_STATUS_COMPLETED, status: 200 };
};

export const getMockSyncStatusFromQuery = (
  mockStatus: null | string,
): MockApiResponse<SyncStatusType> | null => {
  if (!mockStatus) {
    return null;
  }

  switch (mockStatus.toUpperCase()) {
    case 'COMPLETED':
      return { response: MOCK_SYNC_STATUS_COMPLETED, status: 200 };
    case 'FAILED':
      return { response: MOCK_SYNC_STATUS_FAILED, status: 200 };
    case 'NO_SESSION':
      return { response: MOCK_SYNC_STATUS_INVALID_SESSION, status: 401 };
    case 'PROCESSING':
      return { response: MOCK_SYNC_STATUS_PROCESSING, status: 200 };
    case 'REQUIRES_REAUTH':
      return { response: MOCK_SYNC_STATUS_REQUIRES_REAUTH, status: 200 };
    case 'SESSION_EXPIRED':
      return { response: MOCK_SYNC_STATUS_SESSION_EXPIRED, status: 401 };
    default:
      return null;
  }
};

export const getMockPutStudentInfoResponse = (
  payload: PutStudentInfoRequestType,
  mockStatus: null | string,
): MockApiResponse<PutStudentInfoResponseType> => {
  if (mockStatus?.toUpperCase() === 'NO_SESSION') {
    return {
      response: {
        result: {
          reason: 'invalid_session',
          status: 'ERROR',
          studentInfo: null,
        },
        timestamp: MOCK_TIMESTAMP,
      },
      status: 401,
    };
  }

  if (mockStatus?.toUpperCase() === 'SESSION_EXPIRED') {
    return {
      response: {
        result: {
          reason: 'session_expired',
          status: 'ERROR',
          studentInfo: null,
        },
        timestamp: MOCK_TIMESTAMP,
      },
      status: 401,
    };
  }

  return {
    response: {
      result: {
        reason: null,
        status: 'COMPLETED',
        studentInfo: {
          ...payload,
        },
      },
      timestamp: MOCK_TIMESTAMP,
    },
    status: 200,
  };
};
