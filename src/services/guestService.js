import { mockApi } from "./mockApi";

export const guestService = {
  getGuestEventByToken: (token) => {
    const events = mockApi.getEvents();
    const foundEvent = events.find(e => e.qr_token === token || e.id === token) || events[0];
    return Promise.resolve(foundEvent);
  },
  submitGuestConsent: (token, payload) => {
    return Promise.resolve({ success: true, token, consentAcceptedAt: new Date().toISOString() });
  },
  uploadGuestSelfie: (token, payload) => {
    const events = mockApi.getEvents();
    const foundEvent = events.find(e => e.qr_token === token || e.id === token) || events[0];
    const newParticipant = mockApi.createParticipant(foundEvent.id, payload.display_name, payload.selfieUrl);
    return Promise.resolve(newParticipant);
  },
  getGuestAlbums: (token) => {
    return Promise.resolve(mockApi.getEvents());
  },
  getGuestEventPhotos: (token, eventId) => {
    const photos = mockApi.getPhotos(eventId);
    return Promise.resolve(photos);
  },
  deleteGuestFaceData: (token) => {
    return Promise.resolve({ success: true });
  }
};
