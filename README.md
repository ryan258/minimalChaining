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
    - [Enhanced AI Agent](#enhanced-ai-agent)
  - [🛠 Tools Framework](#-tools-framework)
  - [🎭 Demos](#-demos)
  - [🧪 Testing](#-testing)
  - [🎨 Customization](#-customization)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🌟 Overview

MinimalChaining provides a simple yet powerful way to interact with AI models in a sequential, context-aware manner. It's particularly useful for applications that require multi-step AI interactions, such as story generation, complex problem-solving, or any task that benefits from maintaining context across multiple AI queries. The framework now includes an enhanced AI agent capable of using various tools to augment its capabilities.

## ✨ Features

- Sequential, context-aware AI interactions
- Flexible integration with various AI models
- Enhanced AI agent with integrated tools
- Modular design for easy customization and extension
- Built-in utilities for common tasks (file operations, error handling, etc.)
- Comprehensive tool framework for extending AI capabilities
- Demo applications showcasing practical usage

## 📁 Project Structure

```
minimalChaining/
├── MinimalChainable.js
├── MinimalChainable.test.js
├── agents/
│   ├── enhancedAIAgent.js
│   ├── enhancedAIAgent.test.js
│   └── enhancedAIAgent.readme.md
├── tools/
│   ├── apiInteractionTool.js
│   ├── dataVisualizationTool.js
│   ├── fileSystemTool.js
│   ├── nlpTool.js
│   ├── toolIntegrationFramework.js
│   ├── webScrapingTool.js
│   └── TOOLS.readme.md
├── utils/
│   ├── aiUtils.js
│   ├── fileUtils.js
│   ├── loggerUtils.js
│   ├── errorUtils.js
│   ├── envUtils.js
│   └── stringUtils.js
├── demos/
│   ├── storyBuddy/
│   │   └── StoryBuddy.js
│   ├── DebateSimulator.js
│   └── DebateSimulator.readme.md
├── .env
├── .env.example
├── package.json
└── README.md
```

## 📥 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/minimalchaining.git
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
   ```

## 🚀 Usage

Here's a basic example of how to use the MinimalChainable class:

```javascript
const MinimalChainable = require('./MinimalChainable');
const { askAI } = require('./utils/aiUtils');

async function runChain() {
  const context = { topic: "AI" };
  const prompts = [
    "Introduce the concept of {{topic}}",
    "Explain a key application of {{topic}}",
    "Discuss the future of {{topic}}"
  ];

  const [responses, _] = await MinimalChainable.run(
    context,
    'your-model-name',
    askAI,
    prompts
  );

  responses.forEach((response, index) => {
    console.log(`Response ${index + 1}:`, response);
  });
}

runChain();
```

For using the Enhanced AI Agent with tools:

```javascript
const { enhancedAIAgent } = require('./agents/enhancedAIAgent');

async function getWeatherReport() {
  const response = await enhancedAIAgent('Give me a detailed weather report for New York City.');
  console.log('Weather Report:', response);
}

getWeatherReport();
```

## 🧠 Core Components

### MinimalChainable

The heart of the framework, `MinimalChainable` manages the sequence of prompts and responses, maintaining context throughout the chain of interactions.

Key methods:
- `run(context, model, callable, prompts)`: Executes the chain of prompts.
- `toDelimTextFile(name, content, directory)`: Saves the results to a file.

### Enhanced AI Agent

The `enhancedAIAgent` is capable of using various tools to augment its capabilities. It can perform tasks such as web scraping, file manipulation, NLP, API interactions, and data visualization.

## 🛠 Tools Framework

Our tools framework provides a set of utilities that extend the AI's capabilities:

- Web Scraping Tool
- File System Tool
- NLP Tool
- API Interaction Tool
- Data Visualization Tool

For more details, see the [Tools Framework README](./tools/TOOLS.readme.md).

## 🎭 Demos

1. **StoryBuddy**: Generates stories using AI.
   ```
   node demos/storyBuddy/StoryBuddy.js
   ```

2. **DebateSimulator**: Simulates a debate on a given topic.
   ```
   node demos/DebateSimulator.js
   ```

## 🧪 Testing

We use Jest for testing. Run all tests with:

```
npm test
```

To run tests for a specific component:

```
npm test MinimalChainable.test.js
npm test agents/enhancedAIAgent.test.js
```

## 🎨 Customization

MinimalChaining is designed to be easily customizable:

- Modify `MinimalChainable.js` to change the core chaining logic.
- Add or modify utility modules in the `utils/` directory for additional functionality.
- Extend the Enhanced AI Agent in `agents/enhancedAIAgent.js`.
- Add new tools to the `tools/` directory and integrate them into the `toolIntegrationFramework.js`.
- Create new demo applications in the `demos/` directory to showcase different use cases.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Explore the power of chained AI interactions with MinimalChaining! 🚀🔗