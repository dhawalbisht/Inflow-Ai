import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import config from './config/config.js';
import flowchartRoutes from './routes/flowchartRoutes.js';

const app = express();

// Middleware
const allowedOrigins = ['https://inflow-ai.vercel.app'];
app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api', flowchartRoutes);

// Start the server
app.listen(config.port, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
