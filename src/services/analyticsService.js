import { mockApi } from "./mockApi";

export const analyticsService = {
  getDashboardAnalytics: () => {
    return Promise.resolve(mockApi.getAnalytics());
  },
  getEventAnalytics: (eventId) => {
    if (!eventId || eventId === "all") {
      const stats = mockApi.getAnalytics();
      return Promise.resolve(stats.workspaceStats);
    }
    
    const photos = mockApi.getPhotos(eventId);
    const participants = mockApi.getParticipants(eventId);
    const matches = mockApi.getMatches(eventId);
    
    const totalPhotos = photos.length;
    const totalParticipants = participants.filter(p => p.status === "active").length;
    const pendingReviews = matches.filter(m => m.status === "pending_review").length;
    
    const matchedPhotoIds = new Set(
      matches
        .filter(m => m.status === "approved" || m.status === "auto_approved")
        .map(m => m.photo_id)
    );
    const overallMatchRate = totalPhotos > 0 
      ? Math.round((matchedPhotoIds.size / totalPhotos) * 100) 
      : 0;

    const storageUsedGB = parseFloat((totalPhotos * 0.0035).toFixed(2));

    const eventStats = {
      totalPhotos,
      totalParticipants,
      overallMatchRate,
      pendingReviews,
      storageUsedGB,
      storageLimitGB: 50
    };

    return Promise.resolve(eventStats);
  },
  recalculateAnalytics: () => {
    mockApi.recalculateAnalytics();
    return Promise.resolve(mockApi.getAnalytics());
  }
};
