import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { z } from 'zod';

await jest.unstable_mockModule('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const fetch = (await import('node-fetch')).default;
jest.unstable_mockModule('./envUtils.js', () => ({
  __esModule: true,
  getEnvVariable: jest.fn(),
}));
const { getEnvVariable } = await import('./envUtils.js');

describe('openAiUtils', () => {
  // Before each test, we reset all the pretend modules
  beforeEach(() => {
    jest.resetAllMocks();
    getEnvVariable.mockReset();
    getEnvVariable.mockImplementation((key) =>
      key === 'OPENAI_API_KEY' ? 'test-api-key' : 'test-model'
    );
  });

  describe('askOpenAI', () => {
    // This test checks if askOpenAI works correctly when everything goes well
    test('successfully calls OpenAI API and returns response', async () => {
      const { askOpenAI } = await import('./openAiUtils.js');
      const testSchema = z.object({
        key: z.string()
      });
      
      // We're setting up a pretend successful response from OpenAI
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({
          choices: [{ message: { content: '{"key": "value"}' } }]
        })
      };
      fetch.mockResolvedValue(mockResponse);

      // Now we're actually testing our askOpenAI function
      const result = await askOpenAI('Test prompt', testSchema);

      // We check if fetch was called with the right stuff
      expect(fetch).toHaveBeenCalledWith(
        'https://api.openai.com/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': expect.any(String),
          }),
          body: expect.any(String)
        })
      );

      const bodyContent = JSON.parse(fetch.mock.calls[0][1].body);
      expect(bodyContent).toEqual({
          model: 'test-model',
          messages: [{ role: 'user', content: expect.any(String) }],
          temperature: 0.7,
          response_format: { type: "json_object" }
      });

      // Finally, we check if our function returned the right response
      expect(result).toEqual({key: 'value'});
    });

    // This test checks if askOpenAI handles API errors correctly
    test('handles API errors gracefully', async () => {
      const { askOpenAI } = await import('./openAiUtils.js');
      // We're setting up a pretend error response from OpenAI
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        text: jest.fn().mockResolvedValue('Error message')
      };
      fetch.mockResolvedValue(mockResponse);

      // We're also pretending that console.error doesn't actually log anything
      console.error = jest.fn();

      // Now we're testing our askOpenAI function with this error scenario
      await expect(askOpenAI('Test prompt', z.object({}))).rejects.toThrow(
        'OpenAI API error: 500 Internal Server Error\nError message'
      );

      // We check if console.error was called with the right error message
      expect(console.error).toHaveBeenCalledWith(
        " Oops! Something went wrong when talking to OpenAI:",
        expect.any(Error)
      );
    });

    // This test checks if askOpenAI handles network errors correctly
    test('handles network errors gracefully', async () => {
      const { askOpenAI } = await import('./openAiUtils.js');
      // We're setting up a pretend network error
      fetch.mockRejectedValue(new Error('Network error'));

      // We're also pretending that console.error doesn't actually log anything
      console.error = jest.fn();

      // Now we're testing our askOpenAI function with this network error scenario
      await expect(askOpenAI('Test prompt', z.object({}))).rejects.toThrow('Network error');

      // We check if console.error was called with the right error message
      expect(console.error).toHaveBeenCalledWith(
        " Oops! Something went wrong when talking to OpenAI:",
        expect.any(Error)
      );
    });
  });
});