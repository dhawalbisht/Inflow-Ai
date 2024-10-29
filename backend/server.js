import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config.js';
import flowchartRoutes from './routes/flowchartRoutes.js';

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', // Local development
    'https://mindmapai-ai.vercel.app/', // Your Vercel frontend domain
  ],
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api', flowchartRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});