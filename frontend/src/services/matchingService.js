import axios from "axios";
import { API_URL } from "../apiConfig";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getJobMatch = async (jobId) => {
  const response = await axios.get(`${API_URL}/api/matching/job/${jobId}`, {
    headers: authHeaders(),
  });

  return response.data;
};

export const getCompanyMatch = async (companyId) => {
  const response = await axios.get(`${API_URL}/api/matching/${companyId}`, {
    headers: authHeaders(),
  });

  return response.data;
};
