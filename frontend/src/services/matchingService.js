import axios from "axios";

const API_URL = "http://localhost:5000/api/matching";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getJobMatch = async (jobId) => {
  const response = await axios.get(`${API_URL}/job/${jobId}`, {
    headers: authHeaders(),
  });

  return response.data;
};

export const getCompanyMatch = async (companyId) => {
  const response = await axios.get(`${API_URL}/${companyId}`, {
    headers: authHeaders(),
  });

  return response.data;
};
