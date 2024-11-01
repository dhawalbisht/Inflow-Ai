import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 4000,
  cohereApiKey: process.env.COHERE_API_KEY, // Updated to use the new key name for Cohere
};
