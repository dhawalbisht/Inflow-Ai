import config from '../config/config.js';
import cohere from 'cohere-ai';

cohere.init(config.cohereApiKey); // Initialize the Cohere API with your API key

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
    // Call the Cohere generate method
    const response = await cohere.generate({
      model: 'command-xlarge-20221108', // Use the appropriate Cohere model
      prompt: prompt,
      maxTokens: 500,
      temperature: 0.4,
      stopSequences: [],
    });

    const generatedText = response.body.generations[0].text.trim();

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
    throw error; // Propagate the error for handling upstream if needed
  }
};
