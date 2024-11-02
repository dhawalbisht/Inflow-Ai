const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/generate-flowchart', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const cohereResponse = await axios.post(
            'https://api.cohere.com/v1/chat',
            {
                model: 'command-r-08-2024',
                message: `Generate a detailed mind map outlining key concepts, ideas, and relationships associated with the topic "${topic}". with proper definition`,
                temperature: 0.3,
                chatHistory: [],
                promptTruncation: 'AUTO'
            },
            {
                headers: {
                    'Authorization': `Bearer ${COHERE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const flowchartData = cohereResponse.data;

        if (flowchartData) {
            const lines = flowchartData.text.trim().split('\n').slice(0, 20); // Limit to 20 points
            const nodes = lines.map((line, index) => ({
                id: `node-${index}`,
                data: { label: line.trim() }, // Ensure there are no empty labels
                position: { x: Math.random() * 250, y: index * 100 },
            })).filter(node => node.data.label); // Filter out nodes with empty labels

            // Generate edges to connect all nodes
            const edges = nodes.map((node, index) => {
                if (index === 0) return null; // Skip the first node
                return {
                    id: `edge-${index}`,
                    source: `node-${index - 1}`, // Connect to the previous node
                    target: `node-${index}`,
                };
            }).filter(edge => edge !== null); // Remove null edges

            res.json({ flowchartData: nodes, edges });
        } else {
            res.status(500).json({ error: 'No data returned from Cohere API' });
        }
    } catch (error) {
        console.error('Error fetching data from Cohere:', error.message);
        res.status(500).json({ error: 'Failed to generate flowchart data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
