const { askOpenAI } = require('./openAiUtils');
const fetch = require('node-fetch');
const { getEnvVariable } = require('./envUtils');
const { z } = require('zod');

// We're pretending to be the modules we're using
jest.mock('node-fetch');
jest.mock('./envUtils');

describe('openAiUtils', () => {
  // Before each test, we reset all the pretend modules
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('askOpenAI', () => {
    // This is like setting up our pretend world for the test
    beforeEach(() => {
      // We're pretending that our secret API key is "test-api-key"
      getEnvVariable.mockReturnValueOnce('test-api-key').mockReturnValueOnce('test-model');
    });

    // This test checks if askOpenAI works correctly when everything goes well
    test('successfully calls OpenAI API and returns response', async () => {
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
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-api-key'
          },
          body: expect.any(String)
        })
      );

      // We parse the body to check if it contains the right data
      const bodyContent = JSON.parse(fetch.mock.calls[0][1].body);
      expect(bodyContent).toEqual({
        model: 'test-model',
        messages: [{ role: 'user', content: 'Test prompt\n\nPlease provide your response in JSON format.' }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });

      // Finally, we check if our function returned the right response
      expect(result).toEqual({key: 'value'});
    });

    // This test checks if askOpenAI handles API errors correctly
    test('handles API errors gracefully', async () => {
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
      const result = await askOpenAI('Test prompt', z.object({}));

      // We check if console.error was called with the right error message
      expect(console.error).toHaveBeenCalledWith(
        "🚨 Oops! Something went wrong when talking to OpenAI:",
        expect.any(Error)
      );

      // We check if our function returned the right error object
      expect(result).toEqual({
        error: "I couldn't get a proper answer from OpenAI right now. Let's try again later!",
        details: expect.stringContaining("OpenAI API error: 500 Internal Server Error")
      });
    });

    // This test checks if askOpenAI handles network errors correctly
    test('handles network errors gracefully', async () => {
      // We're setting up a pretend network error
      fetch.mockRejectedValue(new Error('Network error'));

      // We're also pretending that console.error doesn't actually log anything
      console.error = jest.fn();

      // Now we're testing our askOpenAI function with this network error scenario
      const result = await askOpenAI('Test prompt', z.object({}));

      // We check if console.error was called with the right error message
      expect(console.error).toHaveBeenCalledWith(
        "🚨 Oops! Something went wrong when talking to OpenAI:",
        expect.any(Error)
      );

      // We check if our function returned the right error object
      expect(result).toEqual({
        error: "I couldn't get a proper answer from OpenAI right now. Let's try again later!",
        details: "Network error"
      });
    });
  });
});