// aiUtils.test.js

const { askAI } = require('./aiUtils');
const fetch = require('node-fetch');

jest.mock('node-fetch');

describe('askAI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully calls AI API and returns response', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ response: 'AI response' }),
    };
    fetch.mockResolvedValue(mockResponse);

    const result = await askAI('http://test-api.com', 'test-model', 'Hello, AI');

    expect(fetch).toHaveBeenCalledWith(
      'http://test-api.com',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      })
    );

    const bodyContent = JSON.parse(fetch.mock.calls[0][1].body);
    expect(bodyContent).toEqual({
      model: 'test-model',
      prompt: 'Hello, AI',
      stream: false,
    });

    expect(result).toBe('AI response');
  });

  test('handles API error', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
    };
    fetch.mockResolvedValue(mockResponse);

    await expect(askAI('http://test-api.com', 'test-model', 'Hello, AI')).rejects.toThrow('HTTP error! status: 500');
  });

  test('handles network error', async () => {
    fetch.mockRejectedValue(new Error('Network error'));

    await expect(askAI('http://test-api.com', 'test-model', 'Hello, AI')).rejects.toThrow('Network error');
  });
});