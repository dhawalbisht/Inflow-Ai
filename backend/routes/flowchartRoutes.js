import cohere from 'cohere-ai';

cohere.init(process.env.COHERE_API_KEY); // Initialize the Cohere client

export const generateFlowchartContent = async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    try {
        const response = await cohere.chat({
            model: 'command-r-08-2024',
            message: `Generate a flowchart content for the topic: ${topic}`,
            temperature: 0.3,
            chat_history: [],
            prompt_truncation: 'AUTO',
            connectors: [{ id: 'web-search' }],
        });

        const flowchartData = response.body.generations[0].text; // Assuming the text is in the first generation

        return res.json({ flowchartData });
    } catch (error) {
        console.error('Error generating flowchart:', error);
        return res.status(500).json({ error: 'Failed to generate flowchart' });
    }
};
