import config from '../config/config.js';

export const generateFlowchartData = async (topic) => {
  const prompt = `Create a Focused Mind Map on "${topic}"

  Please generate a structured mind map centered around the topic of "${topic}" with the following guidelines:
  
  Key Concepts: Provide exactly five key concepts that are directly related to "${topic}".
  Formatting: Present your concepts as a numbered list for clarity.
  Title and Explanation: Each point should begin with a clear title that encapsulates the concept, followed by a brief explanation (one or two sentences) that elaborates on the title.
  Content Specificity: Ensure that all content is specifically relevant to "${topic}", avoiding any unrelated themes or distractions.
  Exclusion of Mathematics: Do not include any mathematical or trigonometric concepts unless they are explicitly requested.
  Example Format:
  [Key Concept 1]: Explanation
  [Key Concept 2]: Explanation
  [Key Concept 3]: Explanation
  [Key Concept 4]: Explanation
  [Key Concept 5]: Explanation
  `;

  try {
    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.deepInfraApiKey}`, // Update to your DeepInfra API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "meta-llama/Meta-Llama-3.1-405B-Instruct", // Specify the model you want to use
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message.content) {
      throw new Error('Invalid response format from DeepInfra API');
    }

    const generatedText = data.choices[0].message.content.trim();

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
