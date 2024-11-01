import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 4000,
  deepInfraApiKey: process.env.DEEPINFRA_API_KEY, // Use the new key name
};
