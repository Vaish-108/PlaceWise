import axios from "axios";
import { API_URL } from "../apiConfig";

// ==========================================
// GET LATEST RESUME
// ==========================================

export const getLatestResume = async (token) => {
  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const response = await axios.get(
    `${API_URL}/api/resume/latest`,
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

  const response = await axios.get(`${API_URL}/api/resume/extracted-skills`, {
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
    `${API_URL}/api/resume/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
