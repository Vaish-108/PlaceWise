import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

const normalizeAuthPayload = (userData = {}) => {
  const collegeCode = userData.collegeCode ?? userData.college ?? "";

  return {
    ...userData,
    collegeCode,
  };
};

export const registerUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/register`,
    normalizeAuthPayload(userData)
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API_URL}/login`,
    normalizeAuthPayload(userData)
  );

  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(
    `${API_URL}/profile`,
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
    `${API_URL}/profile`,
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

  const response = await axios.post(`${API_URL}/profile/photo`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};