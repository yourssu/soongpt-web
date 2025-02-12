import mixpanel from 'mixpanel-browser';
import { Student } from '../schemas/studentSchema';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Initialize MixPanel
mixpanel.init(MIXPANEL_TOKEN, {
  debug: import.meta.env.DEV,
  track_pageview: true,
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
};
