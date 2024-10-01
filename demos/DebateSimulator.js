// demos/DebateSimulator.js

const MinimalChainable = require('../MinimalChainable');
const { askOpenAI } = require('../utils/openAiUtils');
const { asyncErrorHandler } = require('../utils/errorUtils');
const { z } = require('zod');
const { getEnvVariable } = require('../utils/envUtils');

// This is our blueprint for how each debate response should look
const ResponseSchema = z.object({
  content: z.string().describe("The content of the debater's argument"),
  tone: z.enum(["assertive", "diplomatic", "passionate", "logical"]).describe("The tone of the argument")
});

// This function sets up and runs our debate
async function runDebate(topic, rounds) {
  console.log(`🎭 Welcome to the AI Debate Simulator! Today's topic: "${topic}"`);

  // We're creating our debaters - they're like characters in our debate story
  const debaters = [
    { name: "Debater A", position: "Pro" },
    { name: "Debater B", position: "Con" }
  ];

  // We're writing the script for our debate - these are the questions we'll ask each debater
  const prompts = [];
  for (let i = 0; i < rounds; i++) {
    prompts.push(`You are ${debaters[0].name}, arguing for the ${debaters[0].position} position on the topic "${topic}". Respond to the previous argument or, if this is the first round, present your opening statement. Provide your response in JSON format with 'content' and 'tone' fields. The 'tone' should be one of: "assertive", "diplomatic", "passionate", or "logical".`);
    prompts.push(`You are ${debaters[1].name}, arguing for the ${debaters[1].position} position on the topic "${topic}". Respond to the previous argument. Provide your response in JSON format with 'content' and 'tone' fields. The 'tone' should be one of: "assertive", "diplomatic", "passionate", or "logical".`);
  }

  // We're setting up our debate stage
  const context = { topic };
  
  // We're creating an instance of MinimalChainable
  const minimalChainable = new MinimalChainable();

  // Now we're ready to start the debate!
  const [responses] = await minimalChainable.run(
    context,
    getEnvVariable('OPENAI_MODEL'),
    (prompt) => askOpenAI(prompt, ResponseSchema),
    prompts
  );

  // Let's showcase the debate results
  responses.forEach((response, index) => {
    const debater = debaters[index % 2];
    if (response) {
      console.log(`\n${debater.name} (${debater.position}) argues ${response.tone}ly:`);
      console.log(response.content);
    } else {
      console.log(`\n${debater.name} (${debater.position}) failed to respond.`);
    }
  });

  console.log("\n🏁 The debate has concluded. Thank you for attending!");
}

// This function kicks off our debate
function startDebate() {
  const topic = "Is AI a force for good or bad?";
  const rounds = 3;
  asyncErrorHandler(runDebate)(topic, rounds);
}

module.exports = { startDebate };