import { generateFlowchartData } from '../services/deepInfra.js';

export const generateFlowchart = async (req, res) => {
  const { topic } = req.body;

  try {
    const flowchartData = await generateFlowchartData(topic);
    res.json({ flowchartData });
  } catch (error) {
    console.error('Error generating flowchart:', error);
    res.status(500).json({ error: 'Failed to generate flowchart data' });
  }
};