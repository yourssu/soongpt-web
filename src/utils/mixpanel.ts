import mixpanel from 'mixpanel-browser';
import { CoursePreference, Student } from '../schemas/studentSchema';
import { Timetable } from '../schemas/timetableSchema';
import { CourseType } from '../type/course.type';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Initialize MixPanel
mixpanel.init(MIXPANEL_TOKEN, {
  debug: import.meta.env.DEV,
  track_pageview: 'url-with-path',
  persistence: 'localStorage',
});

export const Mixpanel = {
  identify: (id: string) => {
    mixpanel.identify(id);
  },

  setUser: (student: Student) => {
    mixpanel.people.set({
      ...student,
      $last_seen: new Date(),
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

  trackTimetableSelectionError: () => {
    mixpanel.track('Timetable Selection Error');
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
