import { http, HttpResponse } from 'msw';

import { config } from '@/config';
import {
  MOCK_CHAPEL,
  MOCK_DOUBLE_MAJOR,
  MOCK_GENERAL_ELECTIVE,
  MOCK_GENERAL_REQUIRED,
  MOCK_MAJOR_ELECTIVE,
  MOCK_MAJOR_ELECTIVE_GRADE_1,
  MOCK_MAJOR_ELECTIVE_GRADE_3,
  MOCK_MAJOR_ELECTIVE_GRADE_4,
  MOCK_MAJOR_ELECTIVE_GRADE_5,
  MOCK_MAJOR_PREREQUISITE,
  MOCK_MAJOR_REQUIRED,
  MOCK_MINOR,
  MOCK_RETAKE,
  MOCK_TEACHING_CERTIFICATE,
} from '@/mocks/api/courses';
import {
  MOCK_DOUBLE_MAJOR_PROGRESS,
  MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23,
  MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22,
  MOCK_GENERAL_REQUIRED_PROGRESS,
  MOCK_MAJOR_ELECTIVE_PROGRESS,
  MOCK_MAJOR_PREREQUISITE_PROGRESS,
  MOCK_MAJOR_REQUIRED_PROGRESS,
  MOCK_MINOR_PROGRESS,
  MOCK_TEACHING_CERTIFICATE_PROGRESS,
} from '@/mocks/api/creditProgressData';
import { getMockSyncStatusFromQuery, getNextMockSyncStatus } from '@/mocks/api/sso';
import {
  MOCK_FINAL_RECOMMENDATION_FAILURE,
  MOCK_FINAL_RECOMMENDATION_SINGLE_CONFLICT,
  MOCK_FINAL_RECOMMENDATION_SUCCESS,
  MOCK_TIMETABLE_AVAILABLE_COURSES,
  MOCK_TIMETABLE_FINALIZE_RESPONSE,
} from '@/mocks/api/timetableRecommendation';
import { MOCK_TIMETABLE_SUGGEST } from '@/mocks/api/timetableSuggest';
import {
  MOCK_DRAFT_TIMETABLES_RESPONSE,
  MOCK_TIMETABLE_RESPONSE,
} from '@/mocks/devtools/timetables';

const buildSearchResult = (query: null | string) => {
  const pool = [
    ...MOCK_GENERAL_REQUIRED.result,
    ...MOCK_GENERAL_ELECTIVE.result,
    ...MOCK_MAJOR_REQUIRED.result,
    ...MOCK_MAJOR_ELECTIVE.result,
    ...MOCK_MAJOR_ELECTIVE_GRADE_1.result,
    ...MOCK_MAJOR_ELECTIVE_GRADE_3.result,
    ...MOCK_MAJOR_ELECTIVE_GRADE_4.result,
    ...MOCK_MAJOR_ELECTIVE_GRADE_5.result,
    ...MOCK_MAJOR_PREREQUISITE.result,
    ...MOCK_DOUBLE_MAJOR.result,
    ...MOCK_MINOR.result,
    ...MOCK_TEACHING_CERTIFICATE.result,
    ...MOCK_CHAPEL.result,
    ...MOCK_RETAKE.result,
  ];

  if (!query) {
    return [];
  }

  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return [];
  }

  return pool.filter((course) => {
    const name = course.name?.toLowerCase() ?? '';
    const department = course.department?.toLowerCase() ?? '';
    return name.includes(normalizedQuery) || department.includes(normalizedQuery);
  });
};

const BASE_URL = config.apiUrl.replace(/\/+$/, '');

export const handlers = [
  http.get(`${BASE_URL}/courses/major/required`, () => HttpResponse.json(MOCK_MAJOR_REQUIRED)),
  http.get(`${BASE_URL}/courses/general/required`, () => HttpResponse.json(MOCK_GENERAL_REQUIRED)),
  http.get(`${BASE_URL}/courses/general/elective`, () => HttpResponse.json(MOCK_GENERAL_ELECTIVE)),
  http.get(`${BASE_URL}/courses/chapel`, () => HttpResponse.json(MOCK_CHAPEL)),
  http.get(`${BASE_URL}/courses/retake`, () => HttpResponse.json(MOCK_RETAKE)),
  http.get(`${BASE_URL}/courses/major/prerequisite`, () =>
    HttpResponse.json(MOCK_MAJOR_PREREQUISITE),
  ),
  http.get(`${BASE_URL}/courses/major/double`, () => HttpResponse.json(MOCK_DOUBLE_MAJOR)),
  http.get(`${BASE_URL}/courses/minor`, () => HttpResponse.json(MOCK_MINOR)),
  http.get(`${BASE_URL}/courses/teaching-certificate`, () =>
    HttpResponse.json(MOCK_TEACHING_CERTIFICATE),
  ),
  http.get(`${BASE_URL}/courses/major/elective`, ({ request }) => {
    const url = new URL(request.url);
    const grade = url.searchParams.get('grade');
    const majorElectiveByGrade: Record<string, typeof MOCK_MAJOR_ELECTIVE> = {
      '1': MOCK_MAJOR_ELECTIVE_GRADE_1,
      '2': MOCK_MAJOR_ELECTIVE,
      '3': MOCK_MAJOR_ELECTIVE_GRADE_3,
      '4': MOCK_MAJOR_ELECTIVE_GRADE_4,
      '5': MOCK_MAJOR_ELECTIVE_GRADE_5,
    };
    const mockData = grade
      ? (majorElectiveByGrade[grade] ?? MOCK_MAJOR_ELECTIVE)
      : MOCK_MAJOR_ELECTIVE;
    return HttpResponse.json(mockData);
  }),
  http.get(`${BASE_URL}/courses/major/elective/other`, () =>
    HttpResponse.json(MOCK_MAJOR_ELECTIVE),
  ),
  http.get(`${BASE_URL}/courses/search`, ({ request }) => {
    const url = new URL(request.url);
    const content = buildSearchResult(url.searchParams.get('q'));
    return HttpResponse.json({
      timestamp: '2026-02-06 12:00:00',
      result: {
        page: 0,
        size: content.length,
        totalElements: content.length,
        totalPages: 1,
        content,
      },
    });
  }),
  http.get(`${BASE_URL}/courses/major/prerequisite/credit-progress`, () =>
    HttpResponse.json(MOCK_MAJOR_PREREQUISITE_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/major/required/credit-progress`, () =>
    HttpResponse.json(MOCK_MAJOR_REQUIRED_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/major/elective/credit-progress`, () =>
    HttpResponse.json(MOCK_MAJOR_ELECTIVE_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/major/double/credit-progress`, () =>
    HttpResponse.json(MOCK_DOUBLE_MAJOR_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/minor/credit-progress`, () =>
    HttpResponse.json(MOCK_MINOR_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/teaching-certificate/credit-progress`, () =>
    HttpResponse.json(MOCK_TEACHING_CERTIFICATE_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/general/required/credit-progress`, () =>
    HttpResponse.json(MOCK_GENERAL_REQUIRED_PROGRESS),
  ),
  http.get(`${BASE_URL}/courses/general/elective/credit-progress`, ({ request }) => {
    const url = new URL(request.url);
    const schoolId = Number(url.searchParams.get('schoolId') ?? 0);
    const mockData =
      schoolId >= 23
        ? MOCK_GENERAL_ELECTIVE_PROGRESS_AFTER_23
        : MOCK_GENERAL_ELECTIVE_PROGRESS_BEFORE_22;
    return HttpResponse.json(mockData);
  }),
  http.get(`${BASE_URL}/sync/status`, ({ request }) => {
    const url = new URL(request.url);
    const forcedStatus = getMockSyncStatusFromQuery(url.searchParams.get('mockStatus'));

    if (forcedStatus) {
      return HttpResponse.json(forcedStatus);
    }

    return HttpResponse.json(getNextMockSyncStatus());
  }),
  http.get(`${BASE_URL}/timetables/suggest`, () => HttpResponse.json(MOCK_TIMETABLE_SUGGEST)),
  http.post(`${BASE_URL}/timetables/final-recommendation`, ({ request }) => {
    const url = new URL(request.url);
    const mockStatus = url.searchParams.get('mockStatus');

    if (mockStatus === 'SINGLE_CONFLICT') {
      return HttpResponse.json(MOCK_FINAL_RECOMMENDATION_SINGLE_CONFLICT);
    }
    if (mockStatus === 'FAILURE') {
      return HttpResponse.json(MOCK_FINAL_RECOMMENDATION_FAILURE);
    }

    if (mockStatus === 'SUCCESS') {
      return HttpResponse.json(MOCK_FINAL_RECOMMENDATION_SUCCESS);
    }

    return HttpResponse.json(MOCK_FINAL_RECOMMENDATION_SUCCESS);
  }),
  http.post(`${BASE_URL}/timetables/available-courses`, () =>
    HttpResponse.json(MOCK_TIMETABLE_AVAILABLE_COURSES),
  ),
  http.post(`${BASE_URL}/timetables/finalize`, () =>
    HttpResponse.json(MOCK_TIMETABLE_FINALIZE_RESPONSE),
  ),
  http.get(`${BASE_URL}/timetables/:id`, ({ params }) => {
    const timetableId = Number(params.id);
    if (Number.isNaN(timetableId)) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      ...MOCK_TIMETABLE_RESPONSE,
      result: {
        ...MOCK_TIMETABLE_RESPONSE.result,
        timetableId,
      },
    });
  }),
  http.post(`${BASE_URL}/timetables`, () => HttpResponse.json(MOCK_DRAFT_TIMETABLES_RESPONSE)),
  http.post(`${BASE_URL}/contacts`, () => new HttpResponse(null, { status: 204 })),
];
