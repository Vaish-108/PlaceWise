import axios from "axios";

const API_URL = "http://localhost:5000/api/ai";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAISuggestions = async () => {
  const response = await axios.get(
    `${API_URL}/suggestions`,
    {
      headers: authHeaders(),
    }
  );

  return response.data;
};

export const chatWithAI = async (
  message,
  history = []
) => {
  const response = await axios.post(
    `${API_URL}/chat`,
    {
      message,
      history,
    },
    {
      headers: authHeaders(),
    }
  );

  return response.data.response;
};
