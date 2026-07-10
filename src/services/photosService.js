import { mockApi } from "./mockApi";

export const photosService = {
  getPhotos: (eventId) => {
    return Promise.resolve(mockApi.getPhotos(eventId));
  },
  uploadPhotos: (eventId, files, source) => {
    return Promise.resolve(mockApi.uploadPhotos(eventId, files, source));
  },
  deletePhoto: (photoId) => {
    return Promise.resolve(mockApi.deletePhoto(photoId));
  },
  getUploadBatches: (eventId) => {
    return Promise.resolve(mockApi.getUploadBatches(eventId));
  }
};
