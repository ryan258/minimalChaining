// plugins/FocusGroupPlugin.js

// We're bringing in our AI assistant to help with generating responses
const { askAI } = require('../utils/aiUtils');

/**
 * This is our FocusGroupPlugin. It's like having a room full of 
 * smart, imaginative friends who can give us feedback on our ideas!
 */
const FocusGroupPlugin = {
  // This is the name of our plugin, like a fancy sign on our focus group room
  name: 'FocusGroupPlugin',

  // These are our default focus group participants. They're like the main characters in our story!
  defaultPersonas: [
    { name: "Tech Savvy Tina", trait: "Always up-to-date with the latest technology trends" },
    { name: "Eco-Conscious Ethan", trait: "Passionate about environmental sustainability" },
    { name: "Budget-Wise Barbara", trait: "Always looking for the best value for money" },
    { name: "Inclusive Isabelle", trait: "Advocates for accessibility and inclusivity" },
    { name: "Creative Carlos", trait: "Thinks outside the box and loves innovative solutions" }
  ],

  /**
   * This function runs our idea through the focus group
   * @param {string} idea - The idea we want to get feedback on
   * @param {string} context - Any extra information about our idea
   * @param {Object[]} [customPersonas] - Optional custom personas for our focus group
   * @returns {Promise<string>} - A JSON string containing the focus group's detailed feedback
   */
  async evaluateIdea(idea, context, customPersonas = null) {
    console.log(`🎭 Our focus group is now discussing: "${idea}"`);

    const personas = customPersonas || this.defaultPersonas;
    let thoughts, summary, scores, deepDive;

    try {
      thoughts = await Promise.all(personas.map(persona => 
        this.getPersonaThoughts(idea, context, persona).catch(error => {
          console.error(`Error getting thoughts for ${persona.name}:`, error);
          return `${persona.name} was unable to provide thoughts due to an error.`;
        })
      ));
    } catch (error) {
      console.error('Error collecting persona thoughts:', error);
      thoughts = [];
    }

    try {
      summary = await this.summarizeFeedback(idea, thoughts);
    } catch (error) {
      console.error('Error summarizing feedback:', error);
      summary = "Unable to summarize feedback due to an error.";
    }

    try {
      scores = await this.scoreIdea(idea, context, thoughts);
    } catch (error) {
      console.error('Error scoring idea:', error);
      scores = this.getDefaultScores();
    }

    try {
      deepDive = await this.deepDiveAnalysis(idea, context, thoughts);
    } catch (error) {
      console.error('Error in deep dive analysis:', error);
      deepDive = "Unable to perform deep dive analysis due to an error.";
    }

    return JSON.stringify({
      summary,
      individualThoughts: thoughts,
      scores,
      deepDiveAnalysis: deepDive
    });
  },

  /**
   * This function asks one of our focus group members what they think
   * @param {string} idea - The idea we're discussing
   * @param {string} context - Any extra information about our idea
   * @param {Object} persona - The focus group member we're asking
   * @returns {Promise<string>} - What this person thinks about our idea
   */
  async getPersonaThoughts(idea, context, persona) {
    const prompt = `
      You are ${persona.name}. ${persona.trait}
      
      Please provide your thoughts on the following idea, considering your persona:
      
      Idea: ${idea}
      Context: ${context}
      
      Give your response in about 50 words, including any potential concerns or excitement you have.
    `;

    return await askAI(process.env.API_URL, process.env.MODEL_NAME, prompt);
  },

  /**
   * This function summarizes what everyone in the focus group said
   * @param {string} idea - The idea we discussed
   * @param {string[]} thoughts - What each focus group member said
   * @returns {Promise<string>} - A summary of the focus group's feedback
   */
  async summarizeFeedback(idea, thoughts) {
    const prompt = `
      You are a skilled facilitator summarizing a focus group discussion.
      The group discussed the following idea:
      
      "${idea}"
      
      Here are the thoughts from each participant:
      
      ${thoughts.join('\n\n')}
      
      Please provide a concise summary (about 100 words) of the focus group's overall reaction, 
      highlighting key points of agreement, disagreement, and any unique insights.
    `;

    return await askAI(process.env.API_URL, process.env.MODEL_NAME, prompt);
  },

  /**
   * This function scores our idea based on different factors
   * @param {string} idea - The idea we're scoring
   * @param {string} context - Any extra information about our idea
   * @param {string[]} thoughts - What each focus group member said
   * @returns {Promise<Object>} - Scores for different aspects of our idea
   */
  async scoreIdea(idea, context, thoughts) {
    const prompt = `
      Based on the following idea and focus group responses, please score the idea 
      on a scale of 1-10 for each of these categories: Innovation, Feasibility, Market Potential, 
      and Social Impact. Provide a brief justification for each score.

      Idea: ${idea}
      Context: ${context}

      Focus Group Responses:
      ${thoughts.join('\n\n')}

      For each category, please use the format:
      Category: Score
      Justification: Your justification here
    `;

    try {
      const response = await askAI(process.env.API_URL, process.env.MODEL_NAME, prompt);
      
      // Parse the response
      const scores = {};
      const categories = ['innovation', 'feasibility', 'marketPotential', 'socialImpact'];
      
      categories.forEach(category => {
        const regex = new RegExp(`${category}:?\\s*(\\d+)\\s*Justification:?\\s*(.+)`, 'i');
        const match = response.match(regex);
        
        if (match) {
          scores[category] = {
            score: parseInt(match[1]),
            justification: match[2].trim()
          };
        } else {
          console.warn(`Could not find score for ${category}`);
          scores[category] = {
            score: 5,
            justification: `Score not available for ${category}`
          };
        }
      });

      return scores;
    } catch (error) {
      console.error('Error in scoreIdea:', error);
      return this.getDefaultScores();
    }
  },

  /**
   * This function takes a deeper look at any concerns or exciting points raised
   * @param {string} idea - The idea we're analyzing
   * @param {string} context - Any extra information about our idea
   * @param {string[]} thoughts - What each focus group member said
   * @returns {Promise<string>} - A deeper analysis of key points
   */
  async deepDiveAnalysis(idea, context, thoughts) {
    const prompt = `
      You are an expert analyst reviewing a focus group discussion about this idea:
      "${idea}"
      Context: ${context}

      Focus Group Responses:
      ${thoughts.join('\n\n')}

      Please provide a deeper analysis (about 200 words) of the most significant concerns 
      and exciting points raised by the focus group. Consider potential solutions to 
      concerns and ways to capitalize on the exciting aspects.
    `;

    return await askAI(process.env.API_URL, process.env.MODEL_NAME, prompt);
  },

  /**
   * This function provides default scores when we can't get real ones
   * @returns {Object} - Default scores for our idea
   */
  getDefaultScores() {
    return {
      innovation: { score: 5, justification: "Score not available due to an error." },
      feasibility: { score: 5, justification: "Score not available due to an error." },
      marketPotential: { score: 5, justification: "Score not available due to an error." },
      socialImpact: { score: 5, justification: "Score not available due to an error." }
    };
  }
};

// We're making our super-powered FocusGroupPlugin available for other parts of our program to use
module.exports = FocusGroupPlugin;