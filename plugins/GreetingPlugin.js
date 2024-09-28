// plugins/GreetingPlugin.js

/**
 * This is our GreetingPlugin. It's like a friendly robot that knows how to say
 * hello in different languages!
 */
const GreetingPlugin = {
    // This is the name of our plugin, like a name tag for our friendly robot
    name: 'GreetingPlugin',
  
    /**
     * This function says hello in English
     * @param {string} name - The name of the person we're greeting
     * @returns {string} - A nice hello message
     */
    sayHello(name) {
      return `Hello, ${name}!`;
    },
  
    /**
     * This function says hello in Spanish
     * @param {string} name - The name of the person we're greeting
     * @returns {string} - A friendly Spanish greeting
     */
    sayHola(name) {
      return `¡Hola, ${name}!`;
    },
  
    /**
     * This function says hello in French
     * @param {string} name - The name of the person we're greeting
     * @returns {string} - A charming French greeting
     */
    sayBonjour(name) {
      return `Bonjour, ${name}!`;
    }
  };
  
  // We're making our GreetingPlugin available for other parts of our program to use
  module.exports = GreetingPlugin;