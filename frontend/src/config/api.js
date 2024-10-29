// src/config/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const endpoints = {
  generateFlowchart: `${API_BASE_URL}/api/generate-flowchart`,
};