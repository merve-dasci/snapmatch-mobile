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
import messagesReducer from "../features/messages/messagesSlice";
import customersReducer from "../features/customers/customersSlice";
import notificationsReducer, { addLocalNotification } from "../features/notifications/notificationsSlice";

const notificationMiddleware = (storeAPI) => (next) => (action) => {
  const result = next(action);

  if (action.type && action.type.endsWith("/fulfilled")) {
    let title = "";
    let message = "";
    let type = "info";

    switch (action.type) {
      case "events/createEvent/fulfilled":
        title = "Yeni Etkinlik";
        message = "Yeni bir etkinlik oluşturuldu.";
        type = "success";
        break;
      case "events/updateEvent/fulfilled":
        title = "Etkinlik Güncellendi";
        message = "Etkinlik bilgileri başarıyla güncellendi.";
        type = "success";
        break;
      case "events/deleteEvent/fulfilled":
        title = "Etkinlik Silindi";
        message = "Etkinlik sistemden kaldırıldı.";
        type = "warning";
        break;
      case "participants/addParticipant/fulfilled":
        title = "Yeni Katılımcı";
        message = "Sisteme yeni bir katılımcı eklendi.";
        type = "success";
        break;
      case "participants/deleteParticipant/fulfilled":
        title = "Katılımcı Silindi";
        message = "Katılımcı sistemden kaldırıldı.";
        type = "warning";
        break;
      case "photos/uploadPhotos/fulfilled":
        title = "Fotoğraf Yüklendi";
        message = "Yeni fotoğraflar başarıyla yüklendi.";
        type = "success";
        break;
      case "photos/deletePhoto/fulfilled":
        title = "Fotoğraf Silindi";
        message = "Fotoğraf sistemden kaldırıldı.";
        type = "warning";
        break;
      case "customers/addCustomer/fulfilled":
        title = "Yeni Müşteri";
        message = "Sisteme yeni bir müşteri eklendi.";
        type = "success";
        break;
      case "customers/updateCustomer/fulfilled":
        title = "Müşteri Güncellendi";
        message = "Müşteri bilgileri güncellendi.";
        type = "success";
        break;
      case "customers/deleteCustomer/fulfilled":
        title = "Müşteri Silindi";
        message = "Müşteri sistemden kaldırıldı.";
        type = "warning";
        break;
      default:
        // Do not notify for unmapped actions
        return result;
    }

    if (title && message) {
      storeAPI.dispatch(addLocalNotification({
        title,
        message,
        type,
        read: false
      }));
    }
  }

  return result;
};

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
    messages: messagesReducer,
    customers: customersReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(notificationMiddleware),
});