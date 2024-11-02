import express from 'express';
import cohere from 'cohere-ai'; // Make sure this is correctly installed
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const co = new cohere.Client(process.env.COHERE_API_KEY); // Correctly create a new client instance

router.post('/generate-flowchart', async (req, res) => {
    const { topic } = req.body;

    try {
        const response = await co.chat_stream({
            model: 'command-r-08-2024',
            message: topic,
            temperature: 0.3,
            chat_history: [],
            prompt_truncation: 'AUTO',
            connectors: [{ "id": "web-search" }]
        });

        const flowchartData = []; // Process the response data to extract flowchart details

        // Example of processing response - adjust according to your needs
        for (const event of response) {
            if (event.event_type === "text-generation") {
                flowchartData.push(event.text);
            }
        }

        res.status(200).json({ flowchartData });
    } catch (error) {
        console.error("Error generating mind map:", error);
        res.status(500).json({ error: "Failed to generate mind map", details: error.message });
    }
});

// Export the router
export default router;
