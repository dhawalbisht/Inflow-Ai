import express from 'express';
import dotenv from 'dotenv';
import flowchartRoutes from './routes/flowchartRoutes.js'; // Ensure the path is correct

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use('/api', flowchartRoutes); // Use the flowchart routes under the '/api' path

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
