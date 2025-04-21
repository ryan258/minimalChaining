// agents/enhancedAIAgent.test.js

import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Use ESM-compatible mocking for all modules
beforeAll(async () => {
  await jest.unstable_mockModule('../utils/aiUtils.js', () => ({
    __esModule: true,
    askAI: jest.fn(),
  }));
  await jest.unstable_mockModule('../tools/toolIntegrationFramework.js', () => ({
    __esModule: true,
    useTool: jest.fn(),
  }));
});

jest.mock('axios');
jest.mock('cheerio', () => ({
  load: jest.fn(),
}));
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

let enhancedAIAgent, aiUtils, toolIntegration;

describe('enhancedAIAgent', () => {
  beforeEach(async () => {
    jest.resetAllMocks();
    process.env.API_URL = 'http://mock-api-url.com';
    process.env.MODEL_NAME = 'mock-model';
    ({ enhancedAIAgent } = await import('./enhancedAIAgent.js'));
    aiUtils = await import('../utils/aiUtils.js');
    toolIntegration = await import('../tools/toolIntegrationFramework.js');
  });

  test('responds correctly without using tools', async () => {
    aiUtils.askAI.mockResolvedValue('This is a simple response without using tools.');

    const result = await enhancedAIAgent('What is the weather like?');

    expect(aiUtils.askAI).toHaveBeenCalledWith(
      'http://mock-api-url.com',
      'mock-model',
      'What is the weather like?'
    );
    expect(result).toBe('This is a simple response without using tools.');
    expect(toolIntegration.useTool).not.toHaveBeenCalled();
  });

  test('uses a tool when instructed by AI response', async () => {
    aiUtils.askAI.mockResolvedValueOnce('USE_TOOL: webScraper https://example.com')
         .mockResolvedValueOnce('The weather is sunny based on the scraped data.');
    toolIntegration.useTool.mockResolvedValue('Scraped content: Today is sunny.');

    const result = await enhancedAIAgent('What is the weather like?');

    expect(aiUtils.askAI).toHaveBeenCalledTimes(2);
    expect(aiUtils.askAI).toHaveBeenNthCalledWith(1,
      'http://mock-api-url.com',
      'mock-model',
      'What is the weather like?'
    );
    expect(aiUtils.askAI).toHaveBeenNthCalledWith(2,
      'http://mock-api-url.com',
      'mock-model',
      expect.stringContaining('Here\'s the result of using the webScraper tool:')
    );
    expect(toolIntegration.useTool).toHaveBeenCalledWith('webScraper', 'https://example.com');
    expect(result).toBe('The weather is sunny based on the scraped data.');
  });

  test('handles errors gracefully', async () => {
    aiUtils.askAI.mockRejectedValue(new Error('AI service is down'));

    const result = await enhancedAIAgent('What is the weather like?');
    expect(result).toContain('I encountered an error: AI service is down');
  });
});