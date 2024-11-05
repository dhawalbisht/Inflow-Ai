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
                message: `Generate a detailed mind map outlining key concepts, ideas, and relationships associated with the topic "${topic}". Provide a structured list of key points.`,
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

        const flowchartText = cohereResponse.data?.text;
        if (!flowchartText) {
            return res.status(500).json({ error: 'No data returned from Cohere API' });
        }

        // Split response into lines and limit to 20 items
        const lines = flowchartText.trim().split('\n').slice(0, 20);

        // Adjust node positions to prevent overlap
        const nodes = lines.map((line, index) => ({
            id: `node-${index}`,
            data: { label: line.trim() },
            position: {
                x: (index % 5) * 200,  // Spread nodes horizontally every 5 nodes
                y: Math.floor(index / 5) * 150,  // Spread nodes vertically
            },
        })).filter(node => node.data.label); // Filter out nodes with empty labels

        // Connect nodes to central node or in a parent-child structure
        const edges = nodes.slice(1).map((node, index) => ({
            id: `edge-${index + 1}`,
            source: 'node-0',   // Connect each node to the central node (node-0)
            target: node.id,
        }));

        res.json({ flowchartData: nodes, edges });
    } catch (error) {
        console.error('Error fetching data from Cohere:', error.message);
        res.status(500).json({ error: 'Failed to generate flowchart data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
