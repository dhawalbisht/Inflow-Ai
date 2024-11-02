// flowchartService.js
import axios from 'axios';

export const generateFlowchart = async ({ topic }) => {
    const response = await axios.post('http://localhost:4000/api/generate-flowchart', { topic });
    return response.data;
};
