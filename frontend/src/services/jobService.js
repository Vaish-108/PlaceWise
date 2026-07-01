import axios from "axios";


const API_URL =
"http://localhost:5000/api/jobs";



export const getJobs = async()=>{


    const response =
    await axios.get(API_URL);


    return response.data;


};