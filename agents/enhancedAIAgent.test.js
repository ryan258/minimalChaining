// agents/enhancedAIAgent.test.js

const { enhancedAIAgent } = require('./enhancedAIAgent');
const { askAI } = require('../utils/aiUtils');
const { useTool } = require('../tools/toolIntegrationFramework');

// We're pretending to be the modules we're using
jest.mock('../utils/aiUtils');
jest.mock('../tools/toolIntegrationFramework');
jest.mock('axios');
jest.mock('cheerio');
jest.mock('natural', () => ({
  WordTokenizer: jest.fn().mockImplementation(() => ({
    tokenize: jest.fn()
  })),
  SentimentAnalyzer: jest.fn().mockImplementation(() => ({
    getSentiment: jest.fn()
  })),
  PorterStemmer: {},
  BrillPOSTagger: jest.fn().mockImplementation(() => ({
    tag: jest.fn()
  }))
}));
jest.mock('chartjs-to-image', () => {
  return jest.fn().mockImplementation(() => ({
    setConfig: jest.fn(),
    toDataUrl: jest.fn().mockResolvedValue('data:image/png;base64,mockedImageData')
  }));
});

describe('enhancedAIAgent', () => {
  // Before each test, we reset all the pretend modules
  beforeEach(() => {
    jest.resetAllMocks();
    // Mock process.env
    process.env.API_URL = 'http://mock-api-url.com';
    process.env.MODEL_NAME = 'mock-model';
  });

  // This test checks if the agent works correctly without using any tools
  test('responds correctly without using tools', async () => {
    // We're setting up a pretend response from the AI
    askAI.mockResolvedValue('This is a simple response without using tools.');

    const result = await enhancedAIAgent('What is the weather like?');

    // We check if askAI was called with the right stuff
    expect(askAI).toHaveBeenCalledWith(
      'http://mock-api-url.com',
      'mock-model',
      'What is the weather like?'
    );

    // We check if the result is what we expect
    expect(result).toBe('This is a simple response without using tools.');

    // We make sure useTool wasn't called
    expect(useTool).not.toHaveBeenCalled();
  });

  // This test checks if the agent correctly uses a tool when needed
  test('uses a tool when instructed by AI response', async () => {
    // We're setting up pretend responses for the AI and tool
    askAI.mockResolvedValueOnce('USE_TOOL: webScraper https://example.com')
         .mockResolvedValueOnce('The weather is sunny based on the scraped data.');
    useTool.mockResolvedValue('Scraped content: Today is sunny.');

    const result = await enhancedAIAgent('What is the weather like?');

    // We check if askAI was called twice with the right stuff
    expect(askAI).toHaveBeenCalledTimes(2);
    expect(askAI).toHaveBeenNthCalledWith(1,
      'http://mock-api-url.com',
      'mock-model',
      'What is the weather like?'
    );
    expect(askAI).toHaveBeenNthCalledWith(2,
      'http://mock-api-url.com',
      'mock-model',
      expect.stringContaining('Here\'s the result of using the webScraper tool:')
    );

    // We check if useTool was called with the right stuff
    expect(useTool).toHaveBeenCalledWith('webScraper', 'https://example.com');

    // We check if the final result is what we expect
    expect(result).toBe('The weather is sunny based on the scraped data.');
  });

  // This test checks if the agent handles errors correctly
  test('handles errors gracefully', async () => {
    // We're setting up a pretend error
    askAI.mockRejectedValue(new Error('AI service is down'));

    const result = await enhancedAIAgent('What is the weather like?');

    // We check if the result contains our error message
    expect(result).toContain('I encountered an error: AI service is down');
  });
});