//
// Manages plugins
export default new class Plugins {

    /** List of all plugins */
    plugins = []

    /** Constructor */
    constructor() {

        // Load plugins
        this.loadPlugin(require('./compilers/JavaScript.js'))

    }

    /** Load the specified plugin */
    loadPlugin(Plugin) {

        // Check for ES6 import
        if (Plugin.default)
            Plugin = Plugin.default

        // Construct plugin
        let plugin = new Plugin(this)

        // Remove any existing one
        this.plugins = this.plugins.filter(p => p.id == plugin.id)

        // Add it
        this.plugins.push(plugin)

    }

    /** Get a compiler capable of outputting the specified language */
    compiler(outputLanguage) {
        return this.plugins.find(p => p.compilerInfo?.language == outputLanguage)
    }

}