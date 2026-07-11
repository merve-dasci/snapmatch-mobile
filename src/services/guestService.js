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
  },
  getGuestMatchedPhotos: (token, eventId, participantId) => {
    const eventPhotos = mockApi.getPhotos(eventId);
    const matches = mockApi.getMatches ? mockApi.getMatches(eventId) : [];
    const participantMatches = matches.filter(m => m.participant_id === participantId);
    const matchedPhotoIds = new Set(participantMatches.map(m => m.photo_id));
    const matchedPhotos = eventPhotos.filter(p => matchedPhotoIds.has(p.id));
    return Promise.resolve(matchedPhotos);
  },
  uploadGuestPhotos: (token, eventId, files) => {
    const uploaded = mockApi.uploadPhotos(eventId, files, "guest");
    return Promise.resolve(uploaded);
  },
  getGuestFavorites: () => {
    try {
      const stored = localStorage.getItem("sm_guest_favorites");
      return Promise.resolve(stored ? JSON.parse(stored) : []);
    } catch (e) {
      return Promise.resolve([]);
    }
  },
  saveGuestFavorites: (favorites) => {
    try {
      localStorage.setItem("sm_guest_favorites", JSON.stringify(favorites));
      return Promise.resolve(favorites);
    } catch (e) {
      return Promise.resolve(favorites);
    }
  },
  restoreGuestSession: (token) => {
    try {
      const stored = localStorage.getItem(`sm_guest_onboarding_${token}`);
      return Promise.resolve(stored ? JSON.parse(stored) : null);
    } catch (e) {
      return Promise.resolve(null);
    }
  },
  saveGuestSession: (token, payload) => {
    try {
      localStorage.setItem(`sm_guest_onboarding_${token}`, JSON.stringify(payload));
      return Promise.resolve(payload);
    } catch (e) {
      return Promise.resolve(payload);
    }
  }
};
