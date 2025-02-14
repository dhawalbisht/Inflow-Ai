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
                model: 'c4ai-aya-expanse-32b',
                message: `Generate a hierarchical mind map for "${topic}". Structure it in a parent-child format with key points having sub-points.`,
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

        // Split response into lines
        const lines = flowchartText.trim().split('\n').slice(0, 20);

        let nodes = [];
        let edges = [];
        let parentStack = []; // Stack to track parent-child relationships

        // Add central node
        nodes.push({
            id: 'node-0',
            data: { label: topic },
            position: { x: 500, y: 50 },
        });

        lines.forEach((line, index) => {
            let depth = line.search(/\S/); // Determine indentation level
            let nodeId = `node-${index + 1}`;
            let parentId = 'node-0'; // Default parent is the central node

            // Find a suitable parent based on indentation depth
            while (parentStack.length > 0 && parentStack[parentStack.length - 1].depth >= depth) {
                parentStack.pop();
            }
            if (parentStack.length > 0) {
                parentId = parentStack[parentStack.length - 1].id;
            }

            nodes.push({
                id: nodeId,
                data: { label: line.trim() },
                position: {
                    x: 500 + depth * 50,  // Indent nodes based on depth
                    y: 100 + index * 80,
                },
            });

            edges.push({
                id: `edge-${index + 1}`,
                source: parentId,
                target: nodeId,
            });

            parentStack.push({ id: nodeId, depth });
        });

        res.json({ flowchartData: nodes, edges });
    } catch (error) {
        console.error('Error fetching data from Cohere:', error.message);
        res.status(500).json({ error: 'Failed to generate flowchart data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
