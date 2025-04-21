# 🔗 MinimalChaining: Flexible AI Interaction Framework

MinimalChaining is a lightweight, flexible framework for chaining AI interactions and processing the results. It's designed to simplify the process of sending multiple, context-aware prompts to AI models and managing their responses, with integrated tools to enhance AI capabilities.

## 📚 Table of Contents

- [🔗 MinimalChaining: Flexible AI Interaction Framework](#-minimalchaining-flexible-ai-interaction-framework)
  - [📚 Table of Contents](#-table-of-contents)
  - [🌟 Overview](#-overview)
  - [✨ Features](#-features)
  - [📁 Project Structure](#-project-structure)
  - [📥 Installation](#-installation)
  - [🚀 Usage](#-usage)
  - [🧠 Core Components](#-core-components)
    - [MinimalChainable](#minimalchainable)
    - [OpenAI Integration](#openai-integration)
  - [🛠 Tools Framework](#-tools-framework)
  - [🎭 Demos](#-demos)
  - [🧪 Testing](#-testing)
  - [🎨 Customization](#-customization)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🌟 Overview

MinimalChaining provides a simple yet powerful way to interact with AI models in a sequential, context-aware manner. It's particularly useful for applications that require multi-step AI interactions, such as story generation, complex problem-solving, or any task that benefits from maintaining context across multiple AI queries. The framework now includes integration with OpenAI's GPT models and supports structured output.

## ✨ Features

- Sequential, context-aware AI interactions
- Flexible integration with various AI models, including OpenAI's GPT models
- Structured output support for more reliable and consistent AI responses
- Modular design for easy customization and extension
- Built-in utilities for common tasks (file operations, error handling, etc.)
- Demo applications showcasing practical usage

## 📁 Project Structure

```
minimalChaining/
├── MinimalChainable.js
├── MinimalChainable.test.js
├── utils/
│   ├── aiUtils.js
│   ├── openAiUtils.js
│   ├── fileUtils.js
│   ├── loggerUtils.js
│   ├── errorUtils.js
│   ├── envUtils.js
│   └── stringUtils.js
├── demos/
│   └── storyBuddy/
│       ├── StoryBuddy.js
│       └── README.md
├── .env
├── .env.example
├── package.json
└── README.md
```

## 📥 Installation

1. Clone the repository:
   ```
   git clone https://github.com/ryan258/minimalchaining.git
   cd minimalchaining
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your `.env` file in the root directory with your AI model configurations:
   ```
   API_URL=http://localhost:11434/api/generate
   MODEL_NAME=llama3.1:latest
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   ```

## 🚀 Usage

Here's a basic example of how to use the MinimalChainable class with OpenAI integration:

```javascript
const MinimalChainable = require('./MinimalChainable');
const { askOpenAI } = require('./utils/openAiUtils');
const { z } = require('zod');

async function runChain() {
  const context = { topic: "AI" };
  const prompts = [
    "Introduce the concept of {{topic}}",
    "Explain a key application of {{topic}}",
    "Discuss the future of {{topic}}"
  ];

  const StorySchema = z.object({
    content: z.string().describe("The content of the story part"),
    mood: z.enum(["happy", "sad", "excited", "mysterious"]).describe("The mood of this part of the story")
  });

  const [responses, _] = await MinimalChainable.run(
    context,
    process.env.OPENAI_MODEL,
    (prompt) => askOpenAI(prompt, StorySchema),
    prompts
  );

  responses.forEach((response, index) => {
    console.log(`Response ${index + 1} (${response.mood}):`, response.content);
  });
}

runChain();
```

## 🧠 Core Components

### MinimalChainable

The heart of the framework, `MinimalChainable` manages the sequence of prompts and responses, maintaining context throughout the chain of interactions.

Key methods:
- `run(context, model, callable, prompts)`: Executes the chain of prompts.
- `toDelimTextFile(name, content, directory)`: Saves the results to a file.

### OpenAI Integration

The `openAiUtils.js` file provides integration with OpenAI's GPT models, supporting structured output for more reliable and consistent responses.

## 🛠 Tools Framework

Our tools framework provides a set of utilities that extend the AI's capabilities:

- File System Operations
- Logging
- Error Handling
- Environment Variable Management
- String Manipulation

## 🎭 Demos

1. **StoryBuddy**: Generates stories using AI with structured output.
   ```
   node demos/storyBuddy/StoryBuddy.js
   ```

## 🧪 Testing

We use Jest for testing. Run all tests with:

```
npm test
```

## 🎨 Customization

MinimalChaining is designed to be easily customizable:

- Modify `MinimalChainable.js` to change the core chaining logic.
- Add or modify utility modules in the `utils/` directory for additional functionality.
- Create new demo applications in the `demos/` directory to showcase different use cases.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Explore the power of chained AI interactions with MinimalChaining! 🚀🔗