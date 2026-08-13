import axios from "axios";
import { API_URL } from "../apiConfig";

export const getJobs = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/api/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};