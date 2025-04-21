# 🧒 MinimalChainable Handbook for 5th Graders

Welcome to MinimalChainable! This is your super-easy guide to using a magical tool that lets you talk to smart computers (AIs) and make them do cool things, like write stories, answer questions, or even help with homework!

---

## 👋 What is MinimalChainable?

MinimalChainable is like a magic notebook. You write down questions or tasks, and it talks to an AI to get answers. You can even ask it to do a bunch of things in a row, and it remembers what happened before!

---

## 🛠️ What Do You Need?
- A computer with Node.js installed (ask an adult if you need help)
- An internet connection
- This MinimalChainable project (ask your teacher or parent to help you download it)
- An OpenAI API key (get one from your teacher or parent, and NEVER share it online!)

---

## 🚦 Getting Ready (Step by Step)

1. **Download the Project**
   - Ask an adult to help you download the MinimalChainable folder to your computer.

2. **Open the Project Folder**
   - Find the folder on your computer and open it.

3. **Install the Magic Tools**
   - Open a terminal (the black window where you type commands).
   - Type this and press Enter:
     ```
     npm install
     ```

4. **Set Up Your Secret Key**
   - There is a file called `.env.example`. Make a copy and rename it to `.env`.
   - Open `.env` and ask an adult to help you fill in your OpenAI API key (it looks like `sk-...`).
   - Save the file. **Never share your .env file online!**

---

## ✨ Let's Use MinimalChainable!

Here's a super simple example. We'll make the AI tell us about cats in three steps!

1. **Create a file called `myCatStory.js` in the folder.**

2. **Copy and paste this code:**

```js
import MinimalChainable from './MinimalChainable.js';
import { askOpenAI } from './utils/openAiUtils.js';
import { z } from 'zod';

async function runCatStory() {
  const context = { animal: 'cat' };
  const prompts = [
    'Tell me a fun fact about {{animal}}s.',
    'Describe what a {{animal}} likes to do for fun.',
    'What would a {{animal}} say if it could talk?'
  ];

  // This is a shape for our story parts
  const StorySchema = z.object({
    content: z.string().describe('The story part'),
    mood: z.enum(['happy', 'silly', 'curious', 'sleepy']).describe('Mood')
  });

  const [responses] = await MinimalChainable.run(
    context,
    process.env.OPENAI_MODEL,
    (prompt) => askOpenAI(prompt, StorySchema),
    prompts
  );

  responses.forEach((response, i) => {
    console.log(`Part ${i + 1} (${response.mood}):`, response.content);
  });
}

runCatStory();
```

3. **Run your story!**
   - In the terminal, type:
     ```
     node myCatStory.js
     ```
   - Watch the AI create a cat story for you, step by step!

---

## 🧑‍🔬 Things to Try
- Change the animal to `dog`, `dragon`, or even `unicorn`.
- Change the prompts to ask different questions.
- Try making a quiz, a poem, or a mystery story.

---

## 🚨 Safety Tips
- Never share your API key or .env file with anyone online.
- If you get stuck, ask an adult for help.
- Always be kind and use the AI for good things!

---

## 🎉 Have Fun!
MinimalChainable is your playground for learning and creating with AI. Dream big and have fun!
