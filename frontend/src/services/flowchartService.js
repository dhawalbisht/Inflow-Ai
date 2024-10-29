// src/services/flowchartService.js
import axios from 'axios';
import { endpoints } from '../config/api';

export const generateFlowchart = async (inputData) => {
  try {
    const response = await axios.post(endpoints.generateFlowchart, inputData);
    return response.data;
  } catch (error) {
    console.error('Error generating flowchart:', error);
    throw error;
  }
};