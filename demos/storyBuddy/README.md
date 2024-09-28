# 🌟 StoryBuddy: AI-Powered Dual Model Story Generator

StoryBuddy is an interactive, AI-powered story generation tool designed to create unique, imaginative stories using both local and cloud-based AI models. It's built using Node.js and integrates with local AI models through Ollama and cloud-based models through OpenAI.

## 📚 Table of Contents

- [🌟 StoryBuddy: AI-Powered Dual Model Story Generator](#-storybuddy-ai-powered-dual-model-story-generator)
  - [📚 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠 Prerequisites](#-prerequisites)
  - [📥 Installation](#-installation)
  - [🚀 Usage](#-usage)
  - [🧠 How It Works](#-how-it-works)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Configuration](#-configuration)
  - [🎨 Customization](#-customization)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## ✨ Features

- Generate unique stories using two AI models simultaneously
- Local AI model integration via Ollama
- Cloud-based AI model integration via OpenAI
- Modular and extensible codebase
- Automatic story saving with timestamps
- Customizable story elements and prompts

## 🛠 Prerequisites

- Node.js (v12 or higher)
- Ollama set up with the `llama3.1:latest` model
- OpenAI API key

## 📥 Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/storybuddy.git
   cd storybuddy
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   API_URL=http://localhost:11434/api/generate
   MODEL_NAME=llama3.1:latest
   PORT=3000
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_MODEL=gpt-4-mini
   ```

   Replace `your_openai_api_key_here` with your actual OpenAI API key.

## 🚀 Usage

To run StoryBuddy:

```
node demos/storyBuddy/StoryBuddy.js
```

StoryBuddy will generate two stories:
1. One using the local Ollama model
2. Another using the specified OpenAI model

Both stories will be displayed in the console and saved as separate Markdown files in the `demos/storyBuddy/logs/` directory.

## 🧠 How It Works

1. StoryBuddy uses a series of prompts to guide both AI models in creating stories.
2. Each prompt is processed by both AI models, with context from previous responses.
3. The `MinimalChainable` class manages the sequence of prompts and responses for the local model.
4. The OpenAI model processes all prompts in parallel for efficiency.
5. Utility modules handle various aspects like AI interaction, file operations, and error handling.
6. The final stories are displayed in the console and saved as Markdown files.

## 📁 Project Structure

```
minimalChaining/
├── MinimalChainable.js
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
│       ├── README.md
│       └── logs/
└── README.md
```

## 🔧 Configuration

You can configure StoryBuddy by modifying the `.env` file:

- `API_URL`: The URL for your local Ollama instance
- `MODEL_NAME`: The name of the local Ollama model to use
- `PORT`: The port for your application (if needed)
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: The OpenAI model to use (e.g., gpt-4-mini)

## 🎨 Customization

You can customize the story elements by modifying the `context` and `prompts` in `StoryBuddy.js`. For example:

```javascript
const context = {
  hero: "a curious squirrel named Nutkin",
  villain: "a sneaky fox named Sly",
  magic_item: "an enchanted acorn"
};

const prompts = [
  "Introduce {{hero}} living in a big oak tree.",
  "{{hero}} finds {{magic_item}}. What happens?",
  "{{villain}} tries to steal {{magic_item}}!",
  "How does {{hero}} outsmart {{villain}}?"
];
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Happy storytelling with StoryBuddy! 📚✨🤖🌐