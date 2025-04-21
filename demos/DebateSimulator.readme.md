# 🎭 AI Debate Simulator

Welcome to the AI Debate Simulator, a fun and interactive tool that generates debates on any topic using artificial intelligence!

## 📚 Table of Contents

- [🎭 AI Debate Simulator](#-ai-debate-simulator)
  - [📚 Table of Contents](#-table-of-contents)
  - [🌟 Overview](#-overview)
  - [🛠️ Setup](#️-setup)
  - [🚀 Usage](#-usage)
  - [🎨 Customization](#-customization)
  - [🤪 Hilarious Debate Ideas](#-hilarious-debate-ideas)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## 🌟 Overview

The AI Debate Simulator uses the power of AI to generate engaging debates on any topic you choose. It's built on the MinimalChainable framework, allowing for flexible and context-aware AI interactions.

## 🛠️ Setup

1. Ensure you have Node.js installed on your system.
2. Clone this repository:
   ```
   git clone https://github.com/yourusername/ai-debate-simulator.git
   cd ai-debate-simulator
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following content:
   ```
   API_URL=http://localhost:11434/api/generate
   MODEL_NAME=llama3.1:latest
   PORT=3000
   ```
5. Ensure you have Ollama set up with the `llama3.1:latest` model.

## 🚀 Usage

To start a debate:

1. Run the script:
   ```
   node runDebate.js
   ```
2. Follow the prompts to enter:
   - The debate topic
   - The name for the first side of the debate
   - The name for the second side of the debate

3. Sit back and enjoy as the AI generates a lively debate on your chosen topic!

## 🎨 Customization

You can customize the debate structure by modifying the `prompts` array in `DebateSimulator.js`. Feel free to add more arguments, rebuttals, or change the word limits to suit your preferences.

## 🤪 Hilarious Debate Ideas

Want to spice up your debates? Try these absurd but super interesting matchups:

1. **"Should pineapple be on pizza?"**
   - Debaters: Gordon Ramsay vs. SpongeBob SquarePants

2. **"Is the Earth flat or a dinosaur-shaped planet?"**
   - Debaters: Flat Earth Society President vs. Barney the Dinosaur

3. **"Are cats plotting world domination?"**
   - Debaters: Garfield vs. Scooby-Doo

4. **"Should time travel be used to fix embarrassing moments?"**
   - Debaters: Doctor Who vs. Mr. Bean

5. **"Is the Force just fancy telekinesis?"**
   - Debaters: Yoda vs. Professor X

6. **"Should all problems be solved with dance-offs?"**
   - Debaters: Michael Jackson vs. Elsa from Frozen

7. **"Are dragons better pets than unicorns?"**
   - Debaters: Daenerys Targaryen vs. Lisa Frank

8. **"Should gravity be optional on Tuesdays?"**
   - Debaters: Isaac Newton vs. Mary Poppins

9. **"Is the meaning of life 42 or pizza?"**
   - Debaters: Deep Thought (from Hitchhiker's Guide) vs. Homer Simpson

10. **"Should socks be worn on hands instead of feet?"**
    - Debaters: A confused alien vs. A frustrated mitten

Remember, the more absurd the topic and the more mismatched the debaters, the more hilarious the results!

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues to suggest improvements or report bugs.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Now go forth and debate! May your arguments be strong and your rebuttals witty! 🎤🔥