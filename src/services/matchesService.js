import { mockApi } from "./mockApi";

export const matchesService = {
  getMatches: (eventId) => {
    return Promise.resolve(mockApi.getMatches(eventId));
  },
  updateMatchStatus: (matchId, status) => {
    return Promise.resolve(mockApi.updateMatchStatus(matchId, status));
  },
  createManualMatch: (payload) => {
    const { eventId, participantId, photoId } = payload;
    return Promise.resolve(mockApi.createManualMatch(eventId, participantId, photoId));
  }
};
