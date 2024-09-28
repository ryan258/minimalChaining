// demos/HollywoodBlockbusterDemo.js

const { useTool } = require('../tools/toolIntegrationFramework');
const { askOpenAI } = require('../utils/openAiUtils');
const { log, logError } = require('../utils/loggerUtils');

async function generateMovieIdea() {
  const prompt = `
    You are a visionary Hollywood producer. Generate a high-concept idea for a 
    potential blockbuster movie. Include a catchy title and a brief synopsis 
    (2-3 sentences) that would excite both studio executives and audiences.
  `;

  log("🎬 Generating a blockbuster movie idea...", "💡");
  return await askOpenAI(prompt);
}

async function evaluateMovieIdea(idea) {
  log("🎭 Running the movie idea through our focus group...", "🤔");
  try {
    const feedback = await useTool('FocusGroupPlugin', 'evaluateIdea', idea, "This is a potential blockbuster movie concept.");
    return typeof feedback === 'string' ? JSON.parse(feedback) : feedback;
  } catch (error) {
    logError(`Error in focus group evaluation: ${error.message}`);
    return {
      summary: "Unable to get focus group feedback due to an error.",
      individualThoughts: [],
      scores: {},
      deepDiveAnalysis: "No deep dive analysis available due to an error."
    };
  }
}

async function writeMovieScript(idea, focusGroupFeedback) {
  const prompt = `
    You are an accomplished Hollywood screenwriter. Write a short script (about 500 words) 
    for a blockbuster movie based on the following idea:

    ${idea}

    Consider this feedback from a focus group:
    ${JSON.stringify(focusGroupFeedback, null, 2)}

    Incorporate the positive aspects and address the concerns raised by the focus group.
    Your script should include a captivating opening scene, a bit of snappy dialogue, 
    and hint at an exciting climax.
  `;

  log("✍️ Writing a script based on the idea and focus group feedback...", "📝");
  return await askOpenAI(prompt);
}

async function createHollywoodBlockbuster() {
  try {
    const movieIdea = await generateMovieIdea();
    log("Generated Movie Idea:", "🎥");
    log(movieIdea);

    const focusGroupFeedback = await evaluateMovieIdea(movieIdea);
    log("Focus Group Feedback:", "🗣️");
    log(JSON.stringify(focusGroupFeedback, null, 2));

    const movieScript = await writeMovieScript(movieIdea, focusGroupFeedback);
    log("Final Movie Script:", "🍿");
    log(movieScript);

    log("🌟 Our Hollywood blockbuster is ready for production!", "🎉");
  } catch (error) {
    logError("Oops! Something went wrong in our Hollywood process:", error);
  }
}

module.exports = { createHollywoodBlockbuster };