// Base photos for mock data
const basePhotos = [
  {
    id: "ph_1",
    event_id: "evt_1",
    batch_id: "bat_1",
    original_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=80",
    filename: "wedding_dance_01.jpg",
    hash: "h_dance01",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "Canon EOS R5", lens: "50mm f/1.2", time: "2026-07-15T19:30:00Z" }),
    uploaded_at: "2026-07-15T22:00:00Z",
    source: "photographer",
    original_size_bytes: 4200000,
    compressed: false
  },
  {
    id: "ph_2",
    event_id: "evt_1",
    batch_id: "bat_1",
    original_url: "https://images.unsplash.com/photo-1519225495810-7517c296517a?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1519225495810-7517c296517a?w=300&auto=format&fit=crop&q=80",
    filename: "bride_portrait.jpg",
    hash: "h_brideport",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "Canon EOS R5", lens: "85mm f/1.4", time: "2026-07-15T16:15:00Z" }),
    uploaded_at: "2026-07-15T22:01:00Z",
    source: "photographer",
    original_size_bytes: 5600000,
    compressed: false
  },
  {
    id: "ph_3",
    event_id: "evt_1",
    batch_id: "bat_1",
    original_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=300&auto=format&fit=crop&q=80",
    filename: "table_decorations.jpg",
    hash: "h_tabledec",
    status: "processing",
    metadata_json: JSON.stringify({ camera: "Sony A7R IV", lens: "35mm f/1.8", time: "2026-07-15T17:45:00Z" }),
    uploaded_at: "2026-07-15T22:02:00Z",
    source: "photographer",
    original_size_bytes: 9200000, // > 8MB, should simulate auto-compressed
    compressed: true
  },
  {
    id: "ph_4",
    event_id: "evt_1",
    batch_id: "bat_2",
    original_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=300&auto=format&fit=crop&q=80",
    filename: "cake_cutting.jpg",
    hash: "h_cakecut",
    status: "needs_review",
    metadata_json: JSON.stringify({ camera: "Canon EOS R5", lens: "24-70mm f/2.8", time: "2026-07-15T21:00:00Z" }),
    uploaded_at: "2026-07-15T22:30:00Z",
    source: "photographer",
    original_size_bytes: 3800000,
    compressed: false
  },
  {
    id: "ph_5",
    event_id: "evt_1",
    batch_id: "bat_2",
    original_url: "https://images.unsplash.com/photo-1507504038482-7621c3563a70?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1507504038482-7621c3563a70?w=300&auto=format&fit=crop&q=80",
    filename: "guests_laughing.jpg",
    hash: "h_guestslaugh",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "Sony A7R IV", lens: "50mm f/1.4", time: "2026-07-15T20:20:00Z" }),
    uploaded_at: "2026-07-15T22:32:00Z",
    source: "photographer",
    original_size_bytes: 4700000,
    compressed: false
  },
  {
    id: "ph_6",
    event_id: "evt_1",
    batch_id: "bat_3",
    original_url: "https://images.unsplash.com/photo-1513272708688-4c8d8b9d3119?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1513272708688-4c8d8b9d3119?w=300&auto=format&fit=crop&q=80",
    filename: "guest_selfie_wedding.jpg",
    hash: "h_gselfiewed",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "iPhone 15 Pro", lens: "24mm f/1.78", time: "2026-07-15T20:45:00Z" }),
    uploaded_at: "2026-07-15T22:45:00Z",
    source: "guest",
    original_size_bytes: 2500000,
    compressed: false
  },
  // ITU graduation events photos
  {
    id: "ph_7",
    event_id: "evt_2",
    batch_id: "bat_4",
    original_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80",
    filename: "itu_graduation_caps.jpg",
    hash: "h_itucaps",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "Nikon Z9", lens: "70-200mm f/2.8", time: "2026-07-02T11:30:00Z" }),
    uploaded_at: "2026-07-02T15:00:00Z",
    source: "photographer",
    original_size_bytes: 6100000,
    compressed: false
  },
  {
    id: "ph_8",
    event_id: "evt_2",
    batch_id: "bat_4",
    original_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=300&auto=format&fit=crop&q=80",
    filename: "itu_graduates_smiling.jpg",
    hash: "h_itusmile",
    status: "matched",
    metadata_json: JSON.stringify({ camera: "Nikon Z9", lens: "85mm f/1.2", time: "2026-07-02T11:45:00Z" }),
    uploaded_at: "2026-07-02T15:02:00Z",
    source: "photographer",
    original_size_bytes: 11200000, // > 8MB, should simulate auto-compressed
    compressed: true
  },
  {
    id: "ph_9",
    event_id: "evt_2",
    batch_id: "bat_4",
    original_url: "https://images.unsplash.com/photo-1531844251246-9a1bfaae0d56?w=1200&auto=format&fit=crop&q=80",
    thumbnail_url: "https://images.unsplash.com/photo-1531844251246-9a1bfaae0d56?w=300&auto=format&fit=crop&q=80",
    filename: "itu_diploma_speech.jpg",
    hash: "h_ituspeech",
    status: "needs_review",
    metadata_json: JSON.stringify({ camera: "Nikon Z9", lens: "400mm f/2.8", time: "2026-07-02T10:15:00Z" }),
    uploaded_at: "2026-07-02T15:05:00Z",
    source: "photographer",
    original_size_bytes: 7500000,
    compressed: false
  }
];

// Generate up to 55 photos to meet the project's requirements (> 50 photos KPI)
export const mockPhotos = [...basePhotos];

for (let i = 10; i <= 58; i++) {
  const isWedding = i % 2 === 0;
  const eventId = isWedding ? "evt_1" : "evt_2";
  const batchId = isWedding ? "bat_2" : "bat_4";
  const source = i % 6 === 0 ? "guest" : "photographer";
  
  // Use various Unsplash photo collections for events
  const randomKeywords = ["wedding", "graduation", "party", "people", "celebration", "ceremony", "group-photo"];
  const kw = randomKeywords[i % randomKeywords.length];
  
  mockPhotos.push({
    id: `ph_${i}`,
    event_id: eventId,
    batch_id: batchId,
    original_url: `https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=1200&sig=${i}&auto=format&fit=crop&q=80`,
    thumbnail_url: `https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300&sig=${i}&auto=format&fit=crop&q=80`,
    filename: `event_photo_batch_${i}.jpg`,
    hash: `h_photo_${i}`,
    status: i % 12 === 0 ? "needs_review" : (i % 15 === 0 ? "processing" : "matched"),
    metadata_json: JSON.stringify({ camera: "Canon EOS R5", lens: "24-70mm f/2.8", time: "2026-07-15T20:00:00Z" }),
    uploaded_at: "2026-07-15T22:40:00Z",
    source: source,
    original_size_bytes: 3500000 + (i * 95000),
    compressed: (3500000 + (i * 95000)) > 8000000
  });
}
