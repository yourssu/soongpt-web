import { TimetableAvailableCoursesResponseInputType } from '@/api/timetables/post-available-courses/response';
import { TimetableFinalizeResponseInputType } from '@/api/timetables/post-finalize-timetable/response';
import { FinalTimetableRecommendationResponseInputType } from '@/api/timetables/post-timetable-recommendation/response';
import { MOCK_CHAPEL, MOCK_GENERAL_ELECTIVE, MOCK_MAJOR_REQUIRED } from '@/mocks/api/courses';
import { MOCK_DRAFT_TIMETABLES_INPUT, MOCK_TIMETABLE_INPUT } from '@/mocks/devtools/timetables';

export const MOCK_FINAL_RECOMMENDATION_SUCCESS: FinalTimetableRecommendationResponseInputType = {
  timestamp: '2026-02-06 12:00:00',
  result: {
    status: 'SUCCESS',
    successResponse: {
      primaryTimetable: MOCK_TIMETABLE_INPUT,
      alternativeSuggestions: [
        {
          description: '[컴퓨터학개론] → [자료구조] 변경',
          timetable: {
            ...MOCK_DRAFT_TIMETABLES_INPUT[1],
            timetableId: 11001,
          },
        },
        {
          description: '[운영체제] → [파일처리] 변경',
          timetable: {
            ...MOCK_DRAFT_TIMETABLES_INPUT[2],
            timetableId: 11002,
          },
        },
      ],
    },
    singleConflictCourses: null,
  },
};

export const MOCK_FINAL_RECOMMENDATION_SINGLE_CONFLICT: FinalTimetableRecommendationResponseInputType =
  {
    timestamp: '2026-02-06 12:00:00',
    result: {
      status: 'SINGLE_CONFLICT',
      successResponse: null,
      singleConflictCourses: [
        {
          course: MOCK_MAJOR_REQUIRED.result[0],
          category: 'MAJOR_REQUIRED',
        },
        {
          course: MOCK_MAJOR_REQUIRED.result[1],
          category: 'MAJOR_REQUIRED',
        },
      ],
    },
  };

export const MOCK_FINAL_RECOMMENDATION_FAILURE: FinalTimetableRecommendationResponseInputType = {
  timestamp: '2026-02-06 12:00:00',
  result: {
    status: 'FAILURE',
    successResponse: null,
    singleConflictCourses: null,
  },
};

export const MOCK_TIMETABLE_AVAILABLE_COURSES: TimetableAvailableCoursesResponseInputType = {
  timestamp: '2026-02-06 12:00:00',
  result: {
    generalElectives: MOCK_GENERAL_ELECTIVE.result.slice(0, 10),
    chapels: MOCK_CHAPEL.result,
  },
};

export const MOCK_TIMETABLE_FINALIZE_RESPONSE: TimetableFinalizeResponseInputType = {
  timestamp: '2026-02-06 12:00:00',
  result: {
    saved: true,
  },
};
