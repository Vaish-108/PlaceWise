import axios from "axios";

const API_URL = "http://localhost:5000/api/resume";

// ==========================================
// GET LATEST RESUME
// ==========================================

export const getLatestResume = async (token) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await axios.get(
    `${API_URL}/latest`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getExtractedResumeSkills = async (token) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await axios.get(`${API_URL}/extracted-skills`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// ==========================================
// UPLOAD RESUME
// ==========================================

export const uploadResume = async (file, token) => {
  if (!file) {
    throw new Error("Please select a resume file.");
  }

  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const formData = new FormData();

  formData.append("resume", file);

  const response = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
