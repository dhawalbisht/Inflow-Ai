import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { generateFlowchartContent } from './routes/flowchartRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.post('/api/generate-flowchart', generateFlowchartContent);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
