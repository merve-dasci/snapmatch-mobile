export const mockAnalytics = {
  // Global Workspace Stats
  workspaceStats: {
    totalEvents: 12,
    activeEvents: 4,
    totalPhotos: 2450,
    totalParticipants: 342,
    overallMatchRate: 89, // %89 matching rate (matches image Overall Progress)
    pendingReviews: 34,
    storageUsedGB: 32.4,
    storageLimitGB: 100.0,
    averageProcessingTimeSec: 2.4,
    photographerPhotosCount: 2150,
    guestPhotosCount: 300,
    downloadCount: 1240,
    viewCount: 4520
  },

  // Event level metrics
  eventStats: {
    evt_1: {
      photoCount: 145,
      participantCount: 52,
      matchedPhotoCount: 128,
      matchRate: 88,
      pendingReviews: 12,
      guestUploadsCount: 28,
      viewCount: 342,
      downloadCount: 189
    },
    evt_2: {
      photoCount: 420,
      participantCount: 180,
      matchedPhotoCount: 390,
      matchRate: 92,
      pendingReviews: 8,
      guestUploadsCount: 0,
      viewCount: 1250,
      downloadCount: 780
    }
  },

  // Weekly upload activities (Income/Activity chart from Image 1)
  weeklyUploadActivity: [
    { day: "Sun", photographer: 10, guest: 5 },
    { day: "Mon", photographer: 22, guest: 8 },
    { day: "Tue", photographer: 15, guest: 6 },
    { day: "Wed", photographer: 45, guest: 25 }, // peak wedding day/grad
    { day: "Thu", photographer: 18, guest: 10 },
    { day: "Fri", photographer: 30, guest: 15 },
    { day: "Sat", photographer: 50, guest: 35 }
  ],

  // Recent activities list for Audit Log / Timeline
  recentActivities: [
    {
      id: "act_1",
      user: "Ezgi Çelik",
      role: "owner",
      action: "event_create",
      description: "Ece & Mert Düğünü etkinliğini oluşturdu.",
      time: "2026-07-15T10:00:00Z",
      status: "success"
    },
    {
      id: "act_2",
      user: "Kemal Altın (Asistan)",
      role: "uploader",
      action: "photo_upload",
      description: "Batch #12: 50 adet fotoğraf yüklendi.",
      time: "2026-07-15T12:30:00Z",
      status: "success"
    },
    {
      id: "act_3",
      user: "AI Face Matcher",
      role: "system",
      action: "ai_process",
      description: "50 fotoğraf işlendi, 42 yüz tespit edildi, 38 otomatik eşleşme yapıldı.",
      time: "2026-07-15T12:32:00Z",
      status: "success"
    },
    {
      id: "act_4",
      user: "Ezgi Çelik",
      role: "owner",
      action: "match_review",
      description: "Can Arslan için 3 adet eşleşmeyi onayladı.",
      time: "2026-07-15T13:15:00Z",
      status: "success"
    },
    {
      id: "act_5",
      user: "Misafir (Token: tok_ekin)",
      role: "guest",
      action: "guest_join",
      description: "Etkinliğe katıldı ve selfie yükledi.",
      time: "2026-07-15T14:10:00Z",
      status: "success"
    },
    {
      id: "act_6",
      user: "Misafir (Token: tok_ekin)",
      role: "guest",
      action: "guest_upload",
      description: "Etkinliğe 5 adet kendi çektiği fotoğrafı yükledi.",
      time: "2026-07-15T14:15:00Z",
      status: "success"
    }
  ]
};
