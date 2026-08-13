import axios from "axios";
import { API_URL } from "../apiConfig";

export const getAnnouncements = async () => {
    const response = await axios.get(`${API_URL}/api/announcements`);
    return response.data;
};