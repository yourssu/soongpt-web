import mixpanel from 'mixpanel-browser';

import { SoongptError } from '@/schemas/errorSchema';
import { CoursePreference, Student } from '@/schemas/studentSchema';
import { Timetable } from '@/schemas/timetableSchema';
import { CourseType } from '@/types/course';

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

  registerUser: (student: Student) => {
    mixpanel.register({
      ...student,
    });
  },

  setUser: (student: Student) => {
    mixpanel.people.set({
      $name: `${student.department}-${student.schoolId}-${student.grade}학년`,
      $created: new Date(),
      ...student,
    });
  },

  trackUserInformationClick: (student: Student) => {
    mixpanel.track('User Information Click', student);
  },

  trackCourseSelectionClick: (type: CourseType, courses: string[]) => {
    mixpanel.track(`${type} Course Selection Click`, {
      courses,
    });
  },

  trackDesiredCreditClick: (credit: CoursePreference) => {
    mixpanel.track('Desired Credit Click', credit);
  },

  trackTimetableSelectionClick: (
    selectedTimetable: Timetable,
    unselectedTimetables: Timetable[],
  ) => {
    mixpanel.track('Timetable Selection Click', {
      selectedTimetable,
      unselectedTimetables,
    });
  },

  trackTimetableSelectionError: (error: SoongptError) => {
    mixpanel.track('Timetable Selection Error', {
      error,
    });
  },

  trackTimetableSharingEnter: (timetable: Timetable) => {
    mixpanel.track('Timetable Sharing Enter', {
      timetable,
    });
  },

  trackTimetableSaveClick: () => {
    mixpanel.track('Timetable Save Click');
  },

  trackTimetableShareClick: () => {
    mixpanel.track('Timetable Share Click');
  },
};
