export const mockMatches = [
  // Ekin Soylu Matches (part_1)
  {
    id: "m_1",
    event_id: "evt_1",
    participant_id: "part_1",
    photo_id: "ph_1",
    photo_face_id: "pf_1_1",
    confidence: 0.94,
    status: "auto_approved", // >= 0.80
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_2",
    event_id: "evt_1",
    participant_id: "part_1",
    photo_id: "ph_5",
    photo_face_id: "pf_5_1",
    confidence: 0.76,
    status: "pending_review", // 0.60 - 0.80
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_3",
    event_id: "evt_1",
    participant_id: "part_1",
    photo_id: "ph_6", // Guest-uploaded photo
    photo_face_id: "pf_6_1",
    confidence: 0.89,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },

  // Can Arslan Matches (part_2)
  {
    id: "m_4",
    event_id: "evt_1",
    participant_id: "part_2",
    photo_id: "ph_1",
    photo_face_id: "pf_1_2",
    confidence: 0.88,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_5",
    event_id: "evt_1",
    participant_id: "part_2",
    photo_id: "ph_4",
    photo_face_id: "pf_4_1",
    confidence: 0.62,
    status: "pending_review",
    reviewed_by: null,
    reviewed_at: null
  },

  // Ezgi Çelik Matches (part_3)
  {
    id: "m_6",
    event_id: "evt_1",
    participant_id: "part_3",
    photo_id: "ph_2",
    photo_face_id: "pf_2_1",
    confidence: 0.91,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_7",
    event_id: "evt_1",
    participant_id: "part_3",
    photo_id: "ph_5",
    photo_face_id: "pf_5_2",
    confidence: 0.78,
    status: "pending_review",
    reviewed_by: null,
    reviewed_at: null
  },

  // Mert Yılmaz Matches (part_4)
  {
    id: "m_8",
    event_id: "evt_1",
    participant_id: "part_4",
    photo_id: "ph_4",
    photo_face_id: "pf_4_2",
    confidence: 0.84,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_9",
    event_id: "evt_1",
    participant_id: "part_4",
    photo_id: "ph_6",
    photo_face_id: "pf_6_2",
    confidence: 0.72,
    status: "pending_review",
    reviewed_by: null,
    reviewed_at: null
  },

  // Elif Demir Matches (evt_2) (part_5)
  {
    id: "m_10",
    event_id: "evt_2",
    participant_id: "part_5",
    photo_id: "ph_7",
    photo_face_id: "pf_7_1",
    confidence: 0.96,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_11",
    event_id: "evt_2",
    participant_id: "part_5",
    photo_id: "ph_9",
    photo_face_id: "pf_9_1",
    confidence: 0.65,
    status: "pending_review",
    reviewed_by: null,
    reviewed_at: null
  },

  // Burak Şen Matches (evt_2) (part_6)
  {
    id: "m_12",
    event_id: "evt_2",
    participant_id: "part_6",
    photo_id: "ph_8",
    photo_face_id: "pf_8_1",
    confidence: 0.92,
    status: "auto_approved",
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: "m_13",
    event_id: "evt_2",
    participant_id: "part_6",
    photo_id: "ph_9",
    photo_face_id: "pf_9_2",
    confidence: 0.74,
    status: "pending_review",
    reviewed_by: null,
    reviewed_at: null
  }
];

// Dynamically inject some more matches to align with generated photos
for (let i = 10; i <= 58; i++) {
  // Only match some of them to keep it realistic
  if (i % 3 === 0) {
    const isWedding = i % 2 === 0;
    const participantId = isWedding 
      ? `part_${1 + (i % 4)}` // part_1 to part_4 for wedding
      : `part_${5 + (i % 2)}`; // part_5 to part_6 for graduation
    
    const confidence = 0.60 + ((i * 7) % 39) / 100; // random confidence from 0.60 to 0.99
    const status = confidence >= 0.80 ? "auto_approved" : "pending_review";

    mockMatches.push({
      id: `m_dyn_${i}`,
      event_id: isWedding ? "evt_1" : "evt_2",
      participant_id: participantId,
      photo_id: `ph_${i}`,
      photo_face_id: `pf_${i}_1`,
      confidence: parseFloat(confidence.toFixed(2)),
      status: status,
      reviewed_by: null,
      reviewed_at: null
    });
  }
}
