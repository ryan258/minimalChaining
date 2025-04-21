import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';

await jest.unstable_mockModule('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const fetch = (await import('node-fetch')).default;
import { askAI } from './aiUtils.js';

describe('aiUtils', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('askAI', () => {
    test('sends correct request and returns AI response', async () => {
      const mockFetch = fetch;
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'AI response' }),
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await askAI(
        'http://test-api.com',
        'test-model',
        'Hello, AI'
      );

      expect(mockFetch).toHaveBeenCalledWith(
        'http://test-api.com',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        })
      );

      const bodyContent = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(bodyContent).toEqual({
        model: 'test-model',
        prompt: 'Hello, AI',
        stream: false,
      });

      expect(result).toBe('AI response');
    });

    test('handles API error', async () => {
      const mockFetch = fetch;
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockFetch.mockRejectedValue(new Error('API error'));

      const result = await askAI(
        'http://test-api.com',
        'test-model',
        'Hello, AI'
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        "🙈 Oops! Couldn't talk to our AI friend:",
        expect.any(Error)
      );
      expect(result).toBe(
        "The magical AI is taking a nap. Let's try again later!"
      );

      consoleSpy.mockRestore();
    });
  });
});
