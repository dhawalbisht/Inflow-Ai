import express from 'express';
import cohere from 'cohere-ai';
import config from '../config/config.js';

cohere.init(config.cohereApiKey); // Initialize Cohere with your API key

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const stream = cohere.chat_stream({
      model: 'command-r-08-2024',
      message: message,
      temperature: 0.3,
      chat_history: [],
      prompt_truncation: 'AUTO',
      connectors: [{ id: 'web-search' }]
    });

    const responses = [];

    for await (const event of stream) {
      if (event.event_type === 'text-generation') {
        responses.push(event.text);
      }
    }

    res.json({
      id: 'generated-mind-map', // You can generate a unique ID if necessary
      text: responses.join(''),
    });
  } catch (error) {
    console.error('Error generating mind map:', error);
    res.status(500).json({ error: 'Failed to generate mind map', details: error.message });
  }
});

export default router;
