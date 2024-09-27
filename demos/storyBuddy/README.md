# 🌟 StoryBuddy: AI-Powered Story Generator

StoryBuddy is an interactive, AI-powered story generation tool designed to create unique, imaginative stories. It's built using Node.js and integrates with local AI models through Ollama.

## 📚 Table of Contents

- [🌟 StoryBuddy: AI-Powered Story Generator](#-storybuddy-ai-powered-story-generator)
  - [📚 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [📁 Project Structure](#-project-structure)
  - [🛠 Prerequisites](#-prerequisites)
  - [📥 Installation](#-installation)
  - [🚀 Usage](#-usage)
  - [🧠 How It Works](#-how-it-works)
  - [🎨 Customization](#-customization)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## ✨ Features

- Generate unique stories using AI
- Modular and extensible codebase
- Local AI model integration via Ollama
- Automatic story saving with timestamps
- Customizable story elements and prompts

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

## 🛠 Prerequisites

- Node.js (v12 or higher)
- Ollama set up with the `llama3.1:latest` model

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
   ```

## 🚀 Usage

To run StoryBuddy:

```
node demos/storyBuddy/StoryBuddy.js
```

The generated story will be displayed in the console and saved as a Markdown file in the `demos/storyBuddy/logs/` directory.

## 🧠 How It Works

1. StoryBuddy uses a series of prompts to guide the AI in creating a story.
2. Each prompt is processed by the AI model, with context from previous responses.
3. The `MinimalChainable` class manages the sequence of prompts and responses.
4. Utility modules handle various aspects like AI interaction, file operations, and error handling.
5. The final story is displayed in the console and saved as a Markdown file.

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

Happy storytelling with StoryBuddy! 📚✨