import config from '../config/config.js';

export const generateFlowchartData = async (topic) => {
  const prompt = `Create a focused mind map about "${topic}" following these rules:
  1. Provide exactly 5 key concepts directly related to ${topic}
  2. Format as a numbered list
  3. Each point should start with a clear title followed by a brief explanation
  4. All content must be specifically about ${topic}
  5. Do not include any mathematical or trigonometry concepts unless explicitly requested
  
  Format example:
  1. [Key Concept 1]: Explanation
  2. [Key Concept 2]: Explanation
  3. [Key Concept 3]: Explanation
  4. [Key Concept 4]: Explanation
  5. [Key Concept 5]: Explanation`;

  try {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.cohereApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command',
        prompt: prompt,
        max_tokens: 500,
        temperature: 0.4,
        k: 0,
        p: 0.75,
        frequency_penalty: 0.2,
        presence_penalty: 0.2,
        stop_sequences: ["\n\n", "6."],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.generations || !data.generations[0] || !data.generations[0].text) {
      throw new Error('Invalid response format from Cohere API');
    }

    const generatedText = data.generations[0].text.trim();

    // Process the text into structured format
    const concepts = generatedText
      .split(/\d+\.\s+/)
      .filter(item => item.trim())
      .map((item, index) => ({
        id: index + 1,
        content: item.trim()
      }));

    // Validate the response
    if (concepts.length === 0) {
      throw new Error('No valid concepts generated');
    }

    // Check if the content is relevant to the topic
    const topicLower = topic.toLowerCase();
    const isRelevant = concepts.some(concept => 
      concept.content.toLowerCase().includes(topicLower)
    );

    if (!isRelevant) {
      // If not relevant, try again with a more explicit prompt
      return generateFlowchartData(`Specifically explain ${topic}`);
    }

    return concepts;
  } catch (error) {
    console.error('Error in generateFlowchartData:', error);
    throw error;
  }
};