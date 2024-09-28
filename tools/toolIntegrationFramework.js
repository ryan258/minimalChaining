// tools/toolIntegrationFramework.js

// We're bringing in our new PluginManager friend to help us with plugins
const PluginManager = require('../plugins/PluginManager');
const path = require('path');

// We're creating a new PluginManager to handle all our cool plugins
const pluginManager = new PluginManager();

// This is where we keep all our plugins, like a special treehouse for them
const pluginsDirectory = path.join(__dirname, '..', 'plugins');

// We're asking our PluginManager to find and load all the plugins in our treehouse
pluginManager.loadPlugins(pluginsDirectory);

/**
 * This is our magic function that helps our AI agent use a plugin
 * @param {string} pluginName - This is the name of the plugin our AI agent wants to use
 * @param {string} method - This is the specific function of the plugin we want to use
 * @param {...any} args - These are any extra instructions for how to use the plugin
 * @return {Promise<any>} - This is the magic spell (Promise) that will give us the result of using the plugin
 */
async function useTool(pluginName, method, ...args) {
  try {
    // We're asking our PluginManager to use the plugin for us
    return await pluginManager.usePlugin(pluginName, method, ...args);
  } catch (error) {
    // Uh-oh! If something goes wrong, we'll let our AI agent know
    console.error(`Oops! Something went wrong while using the ${pluginName} plugin:`, error.message);
    return `I couldn't use the ${pluginName} plugin because: ${error.message}`;
  }
}

// We're making our tool-using function available for our AI agent to use
module.exports = {
  useTool
};