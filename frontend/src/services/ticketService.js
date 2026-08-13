import axios from "axios";
import { API_URL } from "../apiConfig";


// Student token only
const studentAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


// Admin token only
const adminAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
});



export const createTicket = async (ticketData) => {

  const response = await axios.post(
    `${API_URL}/api/tickets`,
    ticketData,
    {
      headers: studentAuthHeaders(),
    }
  );

  return response.data;
};



export const getMyTickets = async () => {

  const response = await axios.get(
    `${API_URL}/api/tickets`,
    {
      headers: studentAuthHeaders(),
    }
  );

  return response.data;
};



export const getAllTickets = async () => {

  const response = await axios.get(
    `${API_URL}/api/tickets/all`,
    {
      headers: adminAuthHeaders(),
    }
  );

  return response.data;
};



export const updateTicket = async (ticketId, updateData) => {

  const response = await axios.put(
    `${API_URL}/api/tickets/${ticketId}`,
    updateData,
    {
      headers: adminAuthHeaders(),
    }
  );

  return response.data;
};



export const deleteTicket = async (ticketId) => {

  const token =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");


  const response = await axios.delete(
    `${API_URL}/api/tickets/${ticketId}`,
    {
      headers:{
        Authorization:`Bearer ${token}`,
      },
    }
  );


  return response.data;
};