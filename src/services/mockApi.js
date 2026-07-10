import { mockEvents } from "../data/mockEvents";
import { mockPhotos } from "../data/mockPhotos";
import { mockParticipants } from "../data/mockParticipants";
import { mockMatches } from "../data/mockMatches";
import { mockAnalytics } from "../data/mockAnalytics";

// Helper to safely get data with fallback to handle corrupt JSON
const getData = (key, fallback = []) => {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch (e) {
    console.error(`Failed to parse localStorage key "${key}":`, e);
    // Clear corrupt key to allow clean re-init if needed
    localStorage.removeItem(key);
    return fallback;
  }
};

// Helper to safely save data
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to localStorage key "${key}":`, e);
  }
};

const defaultMessages = [
  {
    id: "msg_1",
    sender_id: "katilimci",
    receiver_id: "event_owner",
    text: "Merhaba, eşleşen fotoğraflarıma nereden ulaşabilirim?",
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: "msg_2",
    sender_id: "event_owner",
    receiver_id: "katilimci",
    text: "Merhaba Zeynep, Ana Sayfadaki 'Fotoğraflarım' sekmesine tıklayarak sana ait tüm fotoğrafları görebilirsin.",
    timestamp: new Date(Date.now() - 6840000).toISOString()
  },
  {
    id: "msg_3",
    sender_id: "event_owner",
    receiver_id: "business_admin",
    text: "Ezgi Hanım merhaba, bugünkü etkinlikteki son fotoğraflar yüklendi mi acaba?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "msg_4",
    sender_id: "business_admin",
    receiver_id: "event_owner",
    text: "Merhaba Merve Hanım, evet asistanım Kemal son albümü şimdi tamamladı.",
    timestamp: new Date(Date.now() - 3420000).toISOString()
  }
];

// Initialize LocalStorage with mock data if not already present or corrupt
const initLocalStorage = () => {
  const checkAndInit = (key, mockData) => {
    try {
      const val = localStorage.getItem(key);
      if (!val) {
        localStorage.setItem(key, JSON.stringify(mockData));
      } else {
        JSON.parse(val); // test if valid JSON
      }
    } catch (e) {
      console.warn(`Corrupt or missing data found for key "${key}". Resetting to mock data.`, e);
      localStorage.setItem(key, JSON.stringify(mockData));
    }
  };

  checkAndInit("sm_events", mockEvents);
  checkAndInit("sm_photos", mockPhotos);
  checkAndInit("sm_participants", mockParticipants);
  checkAndInit("sm_matches", mockMatches);
  checkAndInit("sm_analytics", mockAnalytics);
  checkAndInit("sm_messages", defaultMessages);
  checkAndInit("sm_batches", [
    {
      id: "bat_1",
      event_id: "evt_1",
      name: "Nikah Töreni Fotoğrafları",
      uploader: "Ezgi Çelik",
      file_count: 5,
      success_count: 5,
      error_count: 0,
      progress: 100,
      duration_seconds: 4,
      created_at: "2026-07-15T22:00:00Z"
    }
  ]);
};

initLocalStorage();

export const mockApi = {
  // --- EVENTS ---
  getEvents: () => {
    return getData("sm_events", mockEvents);
  },
  
  getEventById: (id) => {
    const events = getData("sm_events", mockEvents);
    return events.find(e => e.id === id) || null;
  },
  
  createEvent: (eventData) => {
    const events = getData("sm_events", mockEvents);
    const newEvent = {
      id: `evt_${Date.now()}`,
      workspace_id: "ws_1",
      status: "draft",
      qr_token: `qr-${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
      ...eventData
    };
    events.push(newEvent);
    saveData("sm_events", events);
    
    // Recalculate analytics immediately
    mockApi.recalculateAnalytics();
    
    // Log activity
    mockApi.logActivity("Ezgi Çelik", "event_create", `"${newEvent.title}" adlı yeni etkinlik oluşturuldu.`, newEvent.id);
    
    return newEvent;
  },
  
  updateEvent: (id, eventData) => {
    const events = getData("sm_events", mockEvents);
    const idx = events.findIndex(e => e.id === id);
    if (idx !== -1) {
      events[idx] = { ...events[idx], ...eventData };
      saveData("sm_events", events);
      
      // Recalculate analytics in case status changed
      mockApi.recalculateAnalytics();
      
      return events[idx];
    }
    return null;
  },

  deleteEvent: (id) => {
    const events = getData("sm_events", mockEvents);
    const filtered = events.filter(e => e.id !== id);
    saveData("sm_events", filtered);
    
    // Cleanup related entries
    const photos = getData("sm_photos", mockPhotos).filter(p => p.event_id !== id);
    const participants = getData("sm_participants", mockParticipants).filter(p => p.event_id !== id);
    const matches = getData("sm_matches", mockMatches).filter(m => m.event_id !== id);
    const batches = getData("sm_batches", []).filter(b => b.event_id !== id);
    
    saveData("sm_photos", photos);
    saveData("sm_participants", participants);
    saveData("sm_matches", matches);
    saveData("sm_batches", batches);
    
    mockApi.recalculateAnalytics();
    mockApi.logActivity("Ezgi Çelik", "event_delete", `Etkinlik (${id}) ve buna bağlı tüm fotoğraf, katılımcı ve eşleşmeler silindi.`);
  },

  // --- PHOTOS ---
  getPhotos: (eventId = null) => {
    const photos = getData("sm_photos", mockPhotos);
    if (eventId) {
      return photos.filter(p => p.event_id === eventId);
    }
    return photos;
  },

  uploadPhotos: (eventId, files = [], source = "photographer") => {
    const photos = getData("sm_photos", mockPhotos);
    const newBatchId = `bat_${Date.now()}`;
    const newPhotos = files.map((file, idx) => {
      const size = file.size || 3500000;
      const isLarge = size > 8000000;
      return {
        id: `ph_uploaded_${Date.now()}_${idx}`,
        event_id: eventId,
        batch_id: newBatchId,
        original_url: file.url || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&sig=" + idx,
        thumbnail_url: file.url || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300&sig=" + idx,
        filename: file.name || `fotoğraf_${idx + 1}.jpg`,
        hash: `h_upload_${Math.random().toString(36).substr(2, 8)}`,
        status: "processing",
        metadata_json: JSON.stringify({ camera: "Canon EOS R5", lens: "50mm f/1.2", time: new Date().toISOString() }),
        uploaded_at: new Date().toISOString(),
        source: source,
        original_size_bytes: size,
        compressed: isLarge
      };
    });
    
    const updatedPhotos = [...newPhotos, ...photos];
    saveData("sm_photos", updatedPhotos);
    
    // Create upload batch record
    mockApi.createUploadBatch(eventId, {
      id: newBatchId,
      name: source === "photographer" ? `Batch Yükleme #${Date.now().toString().slice(-4)}` : "Misafir Yüklemesi",
      uploader: source === "photographer" ? "Ezgi Çelik" : "Misafir",
      file_count: files.length,
      success_count: files.length,
      error_count: 0,
      progress: 100,
      duration_seconds: Math.floor(Math.random() * 5) + 2
    });

    // Log activity
    mockApi.logActivity(
      source === "photographer" ? "Ezgi Çelik" : "Misafir",
      "photo_upload",
      `${newPhotos.length} adet fotoğraf yüklendi (Batch ID: ${newBatchId}).`,
      eventId
    );
    
    // Auto-trigger simulation of face match queue processing after 3 seconds
    setTimeout(() => {
      mockApi.simulateAiMatching(eventId, newPhotos.map(p => p.id));
    }, 3000);

    return newPhotos;
  },

  deletePhoto: (photoId) => {
    const photos = getData("sm_photos", mockPhotos);
    const filtered = photos.filter(p => p.id !== photoId);
    saveData("sm_photos", filtered);

    // Also delete matches for this photo
    const matches = getData("sm_matches", mockMatches);
    const filteredMatches = matches.filter(m => m.photo_id !== photoId);
    saveData("sm_matches", filteredMatches);
    
    mockApi.recalculateAnalytics();
    return true;
  },

  // --- PARTICIPANTS ---
  getParticipants: (eventId = null) => {
    const participants = getData("sm_participants", mockParticipants);
    if (eventId) {
      return participants.filter(p => p.event_id === eventId);
    }
    return participants;
  },

  createParticipant: (eventId, display_name, selfieUrl) => {
    const participants = getData("sm_participants", mockParticipants);
    const newParticipant = {
      id: `part_${Date.now()}`,
      event_id: eventId,
      display_name: display_name,
      email: `${display_name.toLowerCase().replace(/\s+/g, "")}@example.com`,
      phone: "0532 " + Math.floor(1000000 + Math.random() * 9000000),
      guest_token: `tok_guest_${Math.random().toString(36).substr(2, 10)}`,
      consent_accepted_at: new Date().toISOString(),
      status: "active",
      selfie_url: selfieUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      registered_at: new Date().toISOString()
    };
    participants.push(newParticipant);
    saveData("sm_participants", participants);

    mockApi.logActivity(`Misafir (${display_name})`, "guest_join", "Etkinliğe kaydoldu ve selfie yükledi.", eventId);

    // Run matching for this new participant against existing photos of the event
    setTimeout(() => {
      mockApi.simulateAiMatchingForParticipant(eventId, newParticipant.id);
    }, 2000);

    return newParticipant;
  },

  deleteParticipant: (participantId) => {
    const participants = getData("sm_participants", mockParticipants);
    const filtered = participants.filter(p => p.id !== participantId);
    saveData("sm_participants", filtered);

    // Also delete matches for this participant
    const matches = getData("sm_matches", mockMatches);
    const filteredMatches = matches.filter(m => m.participant_id !== participantId);
    saveData("sm_matches", filteredMatches);
    
    mockApi.recalculateAnalytics();
    return true;
  },

  deleteParticipantFaceData: (participantId) => {
    const participants = getData("sm_participants", mockParticipants);
    const idx = participants.findIndex(p => p.id === participantId);
    if (idx !== -1) {
      // Remove face data (selfie)
      participants[idx].selfie_url = null;
      participants[idx].status = "inactive";
      saveData("sm_participants", participants);

      // De-activate/delete matches
      const matches = getData("sm_matches", mockMatches);
      const filteredMatches = matches.filter(m => m.participant_id !== participantId);
      saveData("sm_matches", filteredMatches);

      const p = participants[idx];
      mockApi.logActivity(`Sistem`, "face_delete", `${p.display_name} kullanıcısının yüz kaydı ve eşleşmeleri silindi.`, p.event_id);
      
      mockApi.recalculateAnalytics();
      return true;
    }
    return false;
  },

  updateParticipantSelfie: (participantId, selfieUrl) => {
    const participants = getData("sm_participants", mockParticipants);
    const idx = participants.findIndex(p => p.id === participantId);
    if (idx !== -1) {
      participants[idx].selfie_url = selfieUrl;
      participants[idx].status = "active";
      participants[idx].consent_accepted_at = participants[idx].consent_accepted_at || new Date().toISOString();
      saveData("sm_participants", participants);

      const p = participants[idx];
      mockApi.logActivity(`Sistem`, "selfie_upload", `${p.display_name} kullanıcısına yüz tarama fotoğrafı eklendi.`, p.event_id);

      // Run matching for this participant against existing photos
      mockApi.simulateAiMatchingForParticipant(p.event_id, participantId);
      mockApi.recalculateAnalytics();
      return participants[idx];
    }
    return null;
  },

  // --- MATCHES ---
  getMatches: (eventId = null) => {
    const matches = getData("sm_matches", mockMatches);
    if (eventId) {
      return matches.filter(m => m.event_id === eventId);
    }
    return matches;
  },

  updateMatchStatus: (matchId, status) => {
    const matches = getData("sm_matches", mockMatches);
    const idx = matches.findIndex(m => m.id === matchId);
    if (idx !== -1) {
      matches[idx].status = status;
      matches[idx].reviewed_by = "Ezgi Çelik";
      matches[idx].reviewed_at = new Date().toISOString();
      saveData("sm_matches", matches);
      
      // Update analytics
      mockApi.recalculateAnalytics();

      return matches[idx];
    }
    return null;
  },

  createManualMatch: (eventId, participantId, photoId) => {
    const matches = getData("sm_matches", mockMatches);
    const newMatch = {
      id: `m_manual_${Date.now()}`,
      event_id: eventId,
      participant_id: participantId,
      photo_id: photoId,
      photo_face_id: `pf_manual_${Date.now()}`,
      confidence: 1.0,
      status: "approved",
      reviewed_by: "Ezgi Çelik",
      reviewed_at: new Date().toISOString()
    };
    matches.push(newMatch);
    saveData("sm_matches", matches);

    mockApi.logActivity("Ezgi Çelik", "match_manual", `Fotoğraf (${photoId}) ile katılımcı (${participantId}) manuel eşleştirildi.`, eventId);
    mockApi.recalculateAnalytics();

    return newMatch;
  },

  // --- SIMULATION OF AI QUEUE PIPELINE ---
  simulateAiMatching: (eventId, photoIds) => {
    const photos = getData("sm_photos", mockPhotos);
    const participants = getData("sm_participants", mockParticipants);
    const matches = getData("sm_matches", mockMatches);
    
    const eventParticipants = participants.filter(p => p.event_id === eventId && p.selfie_url && p.status === "active");
    if (eventParticipants.length === 0) {
      // Just mark photos as matched (no face detected or no participants yet)
      photos.forEach(p => {
        if (photoIds.includes(p.id)) {
          p.status = "matched";
        }
      });
      saveData("sm_photos", photos);
      return;
    }

    photoIds.forEach(pId => {
      const pIdx = photos.findIndex(p => p.id === pId);
      if (pIdx !== -1) {
        photos[pIdx].status = "matched"; // mark as processed
        
        // Randomly simulate matching with participants
        eventParticipants.forEach(participant => {
          // 35% chance of matching a face
          if (Math.random() < 0.35) {
            // confidence score between 0.40 and 0.99
            const confidence = parseFloat((0.40 + Math.random() * 0.59).toFixed(2));
            if (confidence >= 0.60) {
              const status = confidence >= 0.80 ? "auto_approved" : "pending_review";
              
              matches.push({
                id: `m_sim_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
                event_id: eventId,
                participant_id: participant.id,
                photo_id: pId,
                photo_face_id: `pf_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                confidence: confidence,
                status: status,
                reviewed_by: null,
                reviewed_at: null
              });
            }
          }
        });
      }
    });

    saveData("sm_photos", photos);
    saveData("sm_matches", matches);
    
    // Refresh analytics totals
    mockApi.recalculateAnalytics();
  },

  simulateAiMatchingForParticipant: (eventId, participantId) => {
    const photos = getData("sm_photos", mockPhotos).filter(p => p.event_id === eventId);
    const matches = getData("sm_matches", mockMatches);

    if (photos.length === 0) return;

    // Run similarity score simulation against event photos
    photos.forEach(photo => {
      // 20% chance this participant is in this photo
      if (Math.random() < 0.20) {
        const confidence = parseFloat((0.40 + Math.random() * 0.59).toFixed(2));
        if (confidence >= 0.60) {
          const status = confidence >= 0.80 ? "auto_approved" : "pending_review";
          
          matches.push({
            id: `m_sim_p_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            event_id: eventId,
            participant_id: participantId,
            photo_id: photo.id,
            photo_face_id: `pf_sim_p_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            confidence: confidence,
            status: status,
            reviewed_by: null,
            reviewed_at: null
          });
        }
      }
    });

    saveData("sm_matches", matches);
    mockApi.recalculateAnalytics();
  },

  // --- ANALYTICS ---
  getAnalytics: () => {
    return getData("sm_analytics", mockAnalytics);
  },

  recalculateAnalytics: () => {
    const events = getData("sm_events", mockEvents);
    const photos = getData("sm_photos", mockPhotos);
    const participants = getData("sm_participants", mockParticipants);
    const matches = getData("sm_matches", mockMatches);
    const analytics = getData("sm_analytics", mockAnalytics);

    const totalEvents = events.length;
    const activeEvents = events.filter(e => e.status === "live").length;
    const totalPhotos = photos.length;
    const totalParticipants = participants.filter(p => p.status === "active").length;
    const pendingReviews = matches.filter(m => m.status === "pending_review").length;
    
    const photographerPhotos = photos.filter(p => p.source === "photographer").length;
    const guestPhotos = photos.filter(p => p.source === "guest").length;

    // Calculate match rate (percentage of photos that have at least one approved/auto-approved match)
    const matchedPhotoIds = new Set(
      matches
        .filter(m => m.status === "approved" || m.status === "auto_approved")
        .map(m => m.photo_id)
    );
    const overallMatchRate = totalPhotos > 0 
      ? Math.round((matchedPhotoIds.size / totalPhotos) * 100) 
      : 0;

    analytics.workspaceStats = {
      ...analytics.workspaceStats,
      totalEvents,
      activeEvents,
      totalPhotos,
      totalParticipants,
      overallMatchRate,
      pendingReviews,
      photographerPhotosCount: photographerPhotos,
      guestPhotosCount: guestPhotos
    };

    saveData("sm_analytics", analytics);
  },

  // --- ACTIVITY LOGGING ---
  logActivity: (user, action, description, eventId = null) => {
    const analytics = getData("sm_analytics", mockAnalytics);
    const newLog = {
      id: `act_${Date.now()}`,
      user: user,
      role: user.includes("Asistan") ? "uploader" : (user.includes("Misafir") ? "guest" : (user.includes("Sistem") ? "system" : "owner")),
      action: action,
      description: description,
      time: new Date().toISOString(),
      status: "success"
    };

    if (!analytics.recentActivities) {
      analytics.recentActivities = [];
    }
    analytics.recentActivities = [newLog, ...analytics.recentActivities].slice(0, 50); // limit to 50 logs
    saveData("sm_analytics", analytics);
  },

  // --- BATCH & BULK ACTIONS ---
  getUploadBatches: (eventId = null) => {
    const batches = getData("sm_batches") || [];
    if (eventId) {
      return batches.filter(b => b.event_id === eventId);
    }
    return batches;
  },

  createUploadBatch: (eventId, batchData) => {
    const batches = getData("sm_batches") || [];
    const newBatch = {
      id: batchData.id || `bat_${Date.now()}`,
      event_id: eventId,
      name: batchData.name || `Batch Yükleme #${batches.length + 1}`,
      uploader: batchData.uploader || "Ezgi Çelik",
      file_count: batchData.file_count || 0,
      success_count: batchData.success_count || 0,
      error_count: batchData.error_count || 0,
      progress: batchData.progress || 100,
      duration_seconds: batchData.duration_seconds || 0,
      created_at: new Date().toISOString()
    };
    saveData("sm_batches", [newBatch, ...batches]);
    return newBatch;
  },

  deletePhotosBulk: (photoIds) => {
    const photos = getData("sm_photos", mockPhotos);
    const filtered = photos.filter(p => !photoIds.includes(p.id));
    saveData("sm_photos", filtered);
    
    // Also clean up any matches relating to those photos
    const matches = getData("sm_matches", mockMatches);
    const filteredMatches = matches.filter(m => !photoIds.includes(m.photo_id));
    saveData("sm_matches", filteredMatches);
    
    mockApi.recalculateAnalytics();
    return true;
  },

  reprocessPhotos: (photoIds) => {
    const photos = getData("sm_photos", mockPhotos);
    const updatedPhotos = photos.map(p => {
      if (photoIds.includes(p.id)) {
        return { ...p, status: "processing" };
      }
      return p;
    });
    saveData("sm_photos", updatedPhotos);

    // Simulate reprocessing AI match flow
    setTimeout(() => {
      const dbPhotos = getData("sm_photos", mockPhotos);
      const updatedDbPhotos = dbPhotos.map(p => {
        if (photoIds.includes(p.id)) {
          const isReview = Math.random() > 0.8;
          return {
            ...p,
            status: isReview ? "needs_review" : "matched"
          };
        }
        return p;
      });
      saveData("sm_photos", updatedDbPhotos);
      mockApi.recalculateAnalytics();
    }, 2500);

    return true;
  },

  removePhotosFromEvent: (photoIds) => {
    const photos = getData("sm_photos", mockPhotos);
    const updated = photos.map(p => {
      if (photoIds.includes(p.id)) {
        return { ...p, event_id: null }; // disassociate
      }
      return p;
    });
    saveData("sm_photos", updated);
    
    // Also disassociate matches
    const matches = getData("sm_matches", mockMatches);
    const filteredMatches = matches.filter(m => !photoIds.includes(m.photo_id));
    saveData("sm_matches", filteredMatches);
    
    mockApi.recalculateAnalytics();
    return true;
  },

  getMessages: () => {
    return getData("sm_messages", defaultMessages);
  },

  sendMessage: (senderId, receiverId, text) => {
    const messages = getData("sm_messages", defaultMessages);
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: senderId,
      receiver_id: receiverId,
      text: text,
      timestamp: new Date().toISOString()
    };
    messages.push(newMsg);
    saveData("sm_messages", messages);
    return newMsg;
  }
};

