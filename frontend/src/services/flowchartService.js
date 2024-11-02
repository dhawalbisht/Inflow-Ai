// flowchartService.js
import axios from 'axios';

// Set the base URL to your deployed backend service
const BASE_URL = 'https://inflow-ai.onrender.com/api';

export const generateFlowchart = async (data) => {
    const response = await axios.post(`${BASE_URL}/generate-flowchart`, data);
    return response.data;
};
