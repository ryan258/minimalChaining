jest.mock('node-fetch')
const fetch = require('node-fetch')
const { askAI } = require('./aiUtils')

describe('aiUtils', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('askAI', () => {
    test('sends correct request and returns AI response', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ response: 'AI response' }),
      }
      fetch.mockResolvedValue(mockResponse)

      const result = await askAI(
        'http://test-api.com',
        'test-model',
        'Hello, AI'
      )

      console.log('Fetch mock calls:', fetch.mock.calls)

      expect(fetch).toHaveBeenCalledWith(
        'http://test-api.com',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.any(String),
        })
      )

      const bodyContent = JSON.parse(fetch.mock.calls[0][1].body)
      expect(bodyContent).toEqual({
        model: 'test-model',
        prompt: 'Hello, AI',
        stream: false,
      })

      expect(result).toBe('AI response')
    })

    test('handles API error', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      fetch.mockRejectedValue(new Error('API error'))

      const result = await askAI(
        'http://test-api.com',
        'test-model',
        'Hello, AI'
      )

      expect(consoleSpy).toHaveBeenCalledWith(
        "🙈 Oops! Couldn't talk to our AI friend:",
        expect.any(Error)
      )
      expect(result).toBe(
        "The magical AI is taking a nap. Let's try again later!"
      )

      consoleSpy.mockRestore()
    })
  })
})
