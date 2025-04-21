# MinimalChainable Advanced Handbook (For Adults)

Welcome to the grown-up's guide to MinimalChainable—your flexible, modular AI automation framework! This handbook is for developers, tinkerers, researchers, and anyone who wants to level up their AI workflow, build smarter chains, and safely integrate AI into real-world projects.

---

## What is MinimalChainable?
MinimalChainable is a lightweight, extensible JavaScript framework for orchestrating multi-step, context-aware AI interactions. It supports:
- Chaining prompts and responses
- Tool integration (web scraping, charting, etc.)
- Structured output with Zod schemas
- Easy extension with your own tools and logic

---

## Getting Started

1. **Clone and Install**
   ```sh
   git clone https://github.com/ryan258/minimalChaining.git
   cd minimalChaining
   npm install
   ```
2. **Set Up Your Environment**
   - Copy `.env.example` to `.env` and fill in your API keys (OpenAI, etc.).
   - Never commit secrets! `.env` is gitignored.

---

## Core Concepts

### 1. The Chain
- A "chain" is a sequence of prompts and AI responses.
- Each step can use context from previous steps.
- Example use cases: story generation, multi-turn Q&A, data extraction, workflow automation.

### 2. Tool Integration
- MinimalChainable supports built-in and custom tools.
- Examples: webScraper, charting, custom APIs.
- Tools can be invoked by the AI agent or directly in your code.

### 3. Structured Output
- Use Zod schemas to enforce and validate AI output structure.
- This makes your chains robust and production-ready.

---

## Example: Advanced Chain with Tool Use

```js
import MinimalChainable from './MinimalChainable.js';
import { askOpenAI } from './utils/openAiUtils.js';
import { z } from 'zod';

async function runResearchChain() {
  const context = { topic: 'climate change' };
  const prompts = [
    'Summarize the latest research on {{topic}}.',
    'Suggest a visualization for this research.',
    'USE_TOOL: webScraper https://climate.nasa.gov/news/',
    'Generate a chart of temperature anomalies over the last decade.'
  ];

  const ResearchSchema = z.object({
    summary: z.string(),
    sources: z.array(z.string())
  });

  const [responses] = await MinimalChainable.run(
    context,
    process.env.OPENAI_MODEL,
    (prompt) => askOpenAI(prompt, ResearchSchema),
    prompts
  );

  responses.forEach((response, i) => {
    console.log(`Step ${i + 1}:`, response);
  });
}

runResearchChain();
```

---

## Extending MinimalChainable
- Add your own tools in `/tools` and register them in `toolIntegrationFramework.js`.
- Create new prompt templates and chain logic for your domain.
- Use environment variables for all secrets and configs.

---

## Best Practices
- **Never commit secrets**—use `.env` and `.gitignore`.
- Validate all AI output with schemas.
- Log errors, but never log secrets.
- Use version control and reset history if a secret is ever leaked.

---

## Troubleshooting
- If tests fail, check your mocks and environment variables.
- If you see a push blocked by GitHub, you likely committed a secret—reset history and rotate keys.
- For ESM/Jest mocking, use `jest.unstable_mockModule` and dynamic imports.

---

## Resources
- [MinimalChainable README](./README.md)
- [Zod Documentation](https://zod.dev/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Jest Docs](https://jestjs.io/docs/ecmascript-modules)

---

## Contributing
- Fork, branch, and PR as usual.
- Always check `.gitignore` before committing.
- Add tests for new tools and chains.

---

Happy chaining! Unleash the power of modular AI in your projects.
