class ConfigManager {
    constructor(storageKey = "userConfig") {
        this.storageKey = storageKey;
        this.initStorage();
    }

    // Ensure localStorage has an initialized config object
    initStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            localStorage.setItem(this.storageKey, JSON.stringify({}));
        }
    }

    // Retrieve the stored configuration
    getStoredConfig() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || {};
    }

    // Save the updated configuration back to localStorage
    saveConfig(config) {
        localStorage.setItem(this.storageKey, JSON.stringify(config));
    }

    /**
     * Get config data for a specific user and configKey
     * @param {string} userName - The user's name
     * @param {string} configKey - The key of the configuration
     * @returns {Object} - The config data (default: {})
     */
    getItem(userName, configKey, defaultValue = {}) {
        const config = this.getStoredConfig();
        return config[userName]?.[configKey] || defaultValue;
    }

    /**
     * Set config data for a specific user and configKey
     * @param {string} userName - The user's name
     * @param {string} configKey - The key of the configuration
     * @param {Object} configData - The data to store
     */
    setItem(userName, configKey, configData) {
        let config = this.getStoredConfig();

        if (!config[userName]) {
            config[userName] = {};  // Initialize user object if missing
        }

        config[userName][configKey] = configData;
        this.saveConfig(config);
    }
}

export default ConfigManager

function test() {
// Example Usage:
const configManager = new ConfigManager();

// Set configuration for a user
configManager.setItem("Adam", "theme", { darkMode: true, fontSize: "large" });
configManager.setItem("Shira", "notifications", { email: true, sms: false });

// Retrieve configurations
console.log(configManager.getItem("Adam", "theme"));  // { darkMode: true, fontSize: "large" }
console.log(configManager.getItem("Shira", "notifications"));  // { email: true, sms: false }

// Get a non-existent key (returns {})
console.log(configManager.getItem("Adam", "unknownKey"));  // {}
console.log(configManager.getItem("UnknownUser", "theme"));  // {}
}
