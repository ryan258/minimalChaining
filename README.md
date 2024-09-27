# 🔗 MinimalChaining: Flexible AI Interaction Framework

MinimalChaining is a lightweight, flexible framework for chaining AI interactions and processing the results. It's designed to simplify the process of sending multiple, context-aware prompts to AI models and managing their responses.

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
  - [🛠 Utility Modules](#-utility-modules)
  - [🎭 Demos](#-demos)
    - [StoryBuddy](#storybuddy)
  - [🎨 Customization](#-customization)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🌟 Overview

MinimalChaining provides a simple yet powerful way to interact with AI models in a sequential, context-aware manner. It's particularly useful for applications that require multi-step AI interactions, such as story generation, complex problem-solving, or any task that benefits from maintaining context across multiple AI queries.

## ✨ Features

- Sequential, context-aware AI interactions
- Flexible integration with various AI models
- Modular design for easy customization and extension
- Built-in utilities for common tasks (file operations, error handling, etc.)
- Demo application (StoryBuddy) showcasing practical usage

## 📁 Project Structure

```
minimalChaining/
├── MinimalChainable.js
├── utils/
│   ├── aiUtils.js
│   ├── fileUtils.js
│   ├── loggerUtils.js
│   ├── errorUtils.js
│   ├── envUtils.js
│   └── stringUtils.js
├── demos/
│   └── storyBuddy/
│       ├── StoryBuddy.js
│       └── logs/
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

3. Set up your `.env` file in the root directory with your AI model configurations.

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

## 🧠 Core Components

### MinimalChainable

The heart of the framework, `MinimalChainable` manages the sequence of prompts and responses, maintaining context throughout the chain of interactions.

Key methods:
- `run(context, model, callable, prompts)`: Executes the chain of prompts.
- `toDelimTextFile(name, content, directory)`: Saves the results to a file.

## 🛠 Utility Modules

- `aiUtils.js`: Handles AI model interactions.
- `fileUtils.js`: Manages file operations.
- `loggerUtils.js`: Provides consistent logging functionality.
- `errorUtils.js`: Offers error handling utilities.
- `envUtils.js`: Manages environment variables.
- `stringUtils.js`: Provides string manipulation functions.

## 🎭 Demos

### StoryBuddy

A demo application that uses MinimalChaining to generate stories with AI. It showcases how to use the framework for creative tasks.

To run StoryBuddy:
```
node demos/storyBuddy/StoryBuddy.js
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