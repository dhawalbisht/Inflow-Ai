import express from 'express';
import { generateFlowchart } from '../controllers/flowchartController.js';

const router = express.Router();

router.post('/generate-flowchart', generateFlowchart);

export default router;