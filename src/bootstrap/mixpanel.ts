import mixpanel from 'mixpanel-browser';

import { SoongptError } from '@/schemas/errorSchema';
import { CoursePreference, Student } from '@/schemas/studentSchema';
import { Timetable } from '@/schemas/timetableSchema';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Initialize MixPanel
mixpanel.init(MIXPANEL_TOKEN, {
  debug: import.meta.env.DEV,
  track_pageview: 'url-with-path',
  persistence: 'localStorage',
  ignore_dnt: true,
  record_sessions_percent: 100,
  record_mask_text_selector: '',
});

export const Mixpanel = {
  identify: (id?: string) => {
    mixpanel.identify(id);
  },

  setUser: (student: Student) => {
    mixpanel.people.set({
      $name: `${student.department}-${student.schoolId}-${student.grade}학년`,
      $created: new Date(),
      count: 0, // 시간표 생성 횟수
      ...student,
    });
  },

  incrementUserCount: () => {
    mixpanel.people.increment('count', 1);
  },

  trackUserInformationClick: () => {
    mixpanel.track('User Information Click');
  },

  trackRegistrationInformationClick: (
    type: 'SCHEDULE' | 'SMALL_GROUPED_CHAPEL' | 'VISION_CHAPEL',
  ) => {
    mixpanel.track('Registration Information Click', {
      type,
    });
  },

  trackRequiredCourseSelectionClick: ({
    type,
    courses,
  }: {
    courses: string[];
    type: 'GENERAL_REQUIRED' | 'MAJOR_REQUIRED';
  }) => {
    mixpanel.track(`${type} Required Course Selection Click`, {
      type,
      courses,
      courseCount: courses.length,
    });
  },

  trackMajorElectiveCourseSelectionClick: ({
    courses,
    otherGradeCourses,
  }: {
    courses: string[];
    otherGradeCourses: string[];
  }) => {
    mixpanel.track('MAJOR_ELECTIVE Course Selection Click', {
      courses,
      otherGradeCourses,
      courseCount: courses.length + otherGradeCourses.length,
    });
  },

  trackCourseSelectionFinishClick: (courses: string[]) => {
    mixpanel.track('Course Selection Finish Click', {
      courses,
    });
  },

  trackCourseDeleteClick: (course: string) => {
    mixpanel.track('Course Delete Click', {
      course,
    });
  },

  trackCourseDeleteConfirmClick: (course: string) => {
    mixpanel.track('Course Delete Confirm Click', {
      course,
    });
  },

  trackCourseSearchClick: () => {
    mixpanel.track('Course Search Click');
  },

  trackSearchCourseAddClick: (course: string) => {
    mixpanel.track('Search Course Add Click', {
      course,
    });
  },

  trackSearchCourseAddConfirmClick: (course: string) => {
    mixpanel.track('Search Course Add Confirm Click', {
      course,
    });
  },

  trackDesiredCreditClick: (credit: CoursePreference) => {
    mixpanel.track('Desired Credit Click', credit);
  },

  trackTimetableGenerateComplete: () => {
    mixpanel.track('Timetable Generate Complete');
  },

  trackTimetableSelectionClick: (selectedTimetable: Timetable) => {
    mixpanel.track('Timetable Selection Click', {
      selectedTimetable,
    });
  },

  trackTimetableSelectionError: (error: SoongptError) => {
    mixpanel.track('Timetable Selection Error', {
      status: error.status,
      message: error.message,
    });
  },
};
