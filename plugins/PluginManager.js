// plugins/PluginManager.js

// We're bringing in a helper to work with files and folders
const fs = require('fs').promises;
const path = require('path');

/**
 * This is our PluginManager class. It's like a friendly robot that helps us
 * organize and use our plugins (which are like special tools for our program).
 */
class PluginManager {
  constructor() {
    // This is where we'll keep all our plugins, like a toolbox
    this.plugins = new Map();
  }

  /**
   * This function helps us add a new plugin to our toolbox
   * @param {string} name - The name of our plugin (like "SuperScraper" or "MegaMailer")
   * @param {Object} plugin - The actual plugin object with all its cool functions
   */
  registerPlugin(name, plugin) {
    // We're putting our new plugin in the toolbox
    this.plugins.set(name, plugin);
    console.log(`Yay! We added a new plugin called ${name} to our toolbox!`);
  }

  /**
   * This function helps us use a plugin from our toolbox
   * @param {string} name - The name of the plugin we want to use
   * @param {string} method - The specific function of the plugin we want to use
   * @param {...any} args - Any extra information our plugin function needs
   * @returns {Promise<any>} - Whatever our plugin function gives back to us
   */
  async usePlugin(name, method, ...args) {
    // We're checking if we have the plugin in our toolbox
    if (!this.plugins.has(name)) {
      throw new Error(`Oops! We can't find a plugin called ${name} in our toolbox.`);
    }

    const plugin = this.plugins.get(name);
    
    // We're checking if the plugin can do what we're asking
    if (typeof plugin[method] !== 'function') {
      throw new Error(`Oh no! The ${name} plugin doesn't know how to ${method}.`);
    }

    // We're using the plugin to do what we asked
    return await plugin[method](...args);
  }

  /**
   * This function helps us load all our plugins from a special folder
   * @param {string} directory - The folder where all our plugins live
   */
  async loadPlugins(directory) {
    try {
      // We're looking at all the files in our plugins folder
      const files = await fs.readdir(directory);
      
      // We're going through each file one by one
      for (const file of files) {
        if (file.endsWith('.js')) {
          // If it's a JavaScript file, we're loading it as a plugin
          const pluginPath = path.join(directory, file);
          const plugin = require(pluginPath);
          
          // We're adding the plugin to our toolbox
          this.registerPlugin(plugin.name, plugin);
        }
      }
      
      console.log(`Hooray! We loaded ${this.plugins.size} plugins from ${directory}`);
    } catch (error) {
      console.error(`Oh no! Something went wrong while loading plugins: ${error.message}`);
    }
  }
}

// We're making our PluginManager available for other parts of our program to use
module.exports = PluginManager;