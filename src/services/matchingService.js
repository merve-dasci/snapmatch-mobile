import { mockApi } from "./mockApi";

const getJobs = () => {
  const val = localStorage.getItem("sm_matching_jobs");
  if (!val) return [];
  try {
    return JSON.parse(val);
  } catch (e) {
    return [];
  }
};

const saveJobs = (jobs) => {
  localStorage.setItem("sm_matching_jobs", JSON.stringify(jobs));
};

export const matchingService = {
  startMatching: (eventId) => {
    const jobs = getJobs();
    const photos = mockApi.getPhotos(eventId);
    const participants = mockApi.getParticipants(eventId);
    
    const newJob = {
      id: `job_${Date.now()}`,
      event_id: eventId,
      status: "processing",
      progress: 0,
      started_at: new Date().toISOString(),
      completed_at: null,
      total_photos: photos.length,
      processed_photos: 0,
      total_participants: participants.length,
      matched_count: 0
    };
    
    jobs.push(newJob);
    saveJobs(jobs);
    return Promise.resolve(newJob);
  },

  getMatchingJob: (jobId) => {
    const jobs = getJobs();
    const job = jobs.find(j => j.id === jobId) || null;
    return Promise.resolve(job);
  },

  getMatchingJobs: (eventId) => {
    const jobs = getJobs();
    const filtered = jobs.filter(j => j.event_id === eventId);
    return Promise.resolve(filtered);
  },

  cancelMatching: (jobId) => {
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      jobs[idx].status = "cancelled";
      jobs[idx].completed_at = new Date().toISOString();
      saveJobs(jobs);
      return Promise.resolve(jobs[idx]);
    }
    return Promise.reject(new Error("Job not found"));
  },

  updateJobLocal: (jobId, updateData) => {
    const jobs = getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      jobs[idx] = { ...jobs[idx], ...updateData };
      saveJobs(jobs);
      return jobs[idx];
    }
    return null;
  }
};
