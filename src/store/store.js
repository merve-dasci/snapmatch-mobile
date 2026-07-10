import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/events/eventsSlice";
import photosReducer from "../features/photos/photosSlice";
import participantsReducer from "../features/participants/participantsSlice";
import matchesReducer from "../features/matches/matchesSlice";
import matchingJobsReducer from "../features/matchingJobs/matchingJobsSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";
import teamReducer from "../features/team/teamSlice";
import uiReducer from "../features/ui/uiSlice";
import guestReducer from "../features/guest/guestSlice";
import settingsReducer from "../features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventsReducer,
    photos: photosReducer,
    participants: participantsReducer,
    matches: matchesReducer,
    matchingJobs: matchingJobsReducer,
    analytics: analyticsReducer,
    team: teamReducer,
    ui: uiReducer,
    guest: guestReducer,
    settings: settingsReducer,
  },
});
