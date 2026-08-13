import axios from "axios";
import { API_URL } from "../apiConfig";

const BASE = `${API_URL}/api/auth`;

const normalizeAuthPayload = (userData = {}) => {
  const collegeCode = userData.collegeCode ?? userData.college ?? "";

  return {
    ...userData,
    collegeCode,
  };
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${BASE}/register`,
    normalizeAuthPayload(userData)
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${BASE}/login`,
    normalizeAuthPayload(userData)
  );

  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(
    `${BASE}/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateProfile = async (
  profileData,
  token
) => {
  const response = await axios.put(
    `${BASE}/profile`,
    profileData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const uploadProfilePhoto = async (file, token) => {
  if (!file) {
    throw new Error("Please select a profile photo.");
  }

  if (!token) {
    throw new Error("Authentication token is missing.");
  }

  const formData = new FormData();
  formData.append("photo", file);

  const response = await axios.post(`${BASE}/profile/photo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};