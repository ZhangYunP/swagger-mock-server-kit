const { resolve } = require("path");

const pluginPath = resolve(__dirname, "../plugins");

const demoplugin = resolve(pluginPath, "random-image.js");

module.exports = {
  plugins: [demoplugin]
};
