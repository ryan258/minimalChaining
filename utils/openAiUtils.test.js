// openAiUtils.test.js

const { askOpenAI } = require('./openAiUtils');
const { z } = require('zod');
const OpenAI = require('openai');

jest.mock('openai');
jest.mock('./envUtils', () => ({
  getEnvVariable: jest.fn((key) => {
    if (key === 'OPENAI_API_KEY') return 'test-api-key';
    if (key === 'OPENAI_MODEL') return 'gpt-4o-mini';
    return null;
  }),
}));

describe('askOpenAI', () => {
  const TestSchema = z.object({
    content: z.string(),
    tone: z.enum(['assertive', 'diplomatic', 'passionate', 'logical']),
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('successfully calls OpenAI API and returns parsed response', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: '{"content":"This is a test response","tone":"assertive"}',
          },
        },
      ],
    });
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    const prompt = 'Test prompt';
    const result = await askOpenAI(prompt, TestSchema);

    expect(OpenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
      model: 'gpt-4o-mini',
      messages: expect.arrayContaining([
        expect.objectContaining({ role: 'system' }),
        expect.objectContaining({ role: 'user', content: expect.stringContaining('Test prompt') })
      ]),
      response_format: { type: 'json_object' },
    }));

    expect(result).toEqual({
      content: 'This is a test response',
      tone: 'assertive',
    });
  });

  test('throws an error when API call fails', async () => {
    const mockCreate = jest.fn().mockRejectedValue(new Error('API Error'));
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    await expect(askOpenAI('Test prompt', TestSchema)).rejects.toThrow('API Error');
  });

  test('throws an error when response is not valid JSON', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: 'This is not JSON',
          },
        },
      ],
    });
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    await expect(askOpenAI('Test prompt', TestSchema)).rejects.toThrow(SyntaxError);
  });

  test('throws an error when response does not match schema', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {
            content: '{"content":"This is a test response","tone":"invalid_tone"}',
          },
        },
      ],
    });
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    await expect(askOpenAI('Test prompt', TestSchema)).rejects.toThrow(z.ZodError);
  });

  test('handles empty response from API', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [],
    });
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    await expect(askOpenAI('Test prompt', TestSchema)).rejects.toThrow('No response from OpenAI');
  });

  test('handles undefined content in API response', async () => {
    const mockCreate = jest.fn().mockResolvedValue({
      choices: [
        {
          message: {},
        },
      ],
    });
    OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    }));

    await expect(askOpenAI('Test prompt', TestSchema)).rejects.toThrow('No content in OpenAI response');
  });
});