import { mockApi } from "./mockApi";

export const participantsService = {
  getParticipants: (eventId) => {
    return Promise.resolve(mockApi.getParticipants(eventId));
  },
  createParticipant: (payload) => {
    const { eventId, display_name, selfieUrl } = payload;
    return Promise.resolve(mockApi.createParticipant(eventId, display_name, selfieUrl));
  },
  deleteParticipantFaceData: (participantId) => {
    return Promise.resolve(mockApi.deleteParticipantFaceData(participantId));
  },
  deleteParticipant: (participantId) => {
    return Promise.resolve(mockApi.deleteParticipant(participantId));
  }
};
