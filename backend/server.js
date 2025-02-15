const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.use(cors());
app.use(express.json());

app.post('/api/generate-flowchart', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const openAIResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4-turbo', // Best model for structured output
                messages: [
                    {
                        role: 'system',
                        content: `You are an AI assistant that specializes in generating hierarchical mind maps and flowcharts. 
                        Your goal is to take a given topic and break it down into a structured format where main topics have subtopics, 
                        and each subtopic is further broken down if necessary. The output should follow a clear numbering system.`
                    },
                    {
                        role: 'user',
                        content: `Generate a hierarchical mind map for "${topic}". Use the following format:

1. **Main Topic**
   1.1 Subtopic A
       1.1.1 Detail A1
       1.1.2 Detail A2
   1.2 Subtopic B
       1.2.1 Detail B1
       1.2.2 Detail B2
2. **Second Main Topic**
   2.1 Subtopic C
       2.1.1 Detail C1
       2.1.2 Detail C2

Ensure indentation and numbering are correctly followed for easy parsing.`
                    }
                ],
                temperature: 0.3,
                max_tokens: 700
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const flowchartText = openAIResponse.data.choices[0]?.message?.content;
        if (!flowchartText) {
            return res.status(500).json({ error: 'No data returned from OpenAI API' });
        }

        // Split response into lines
        const lines = flowchartText.trim().split('\n').slice(0, 30);

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
            let depth = (line.match(/\d+\./g) || []).length; // Determine hierarchy depth
            let nodeId = `node-${index + 1}`;
            let parentId = 'node-0'; // Default parent is the central node

            // Find a suitable parent based on hierarchy depth
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
        console.error('Error fetching data from OpenAI:', error.message);
        res.status(500).json({ error: 'Failed to generate flowchart data' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
