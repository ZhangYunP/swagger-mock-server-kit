const {
  resolve
} = require("path");

const appRoot = resolve(__dirname, "..");

const pluginPath = resolve(appRoot, "plugins");

const demoplugin = resolve(pluginPath, "random-image.js");

module.exports = {
  plugins: [demoplugin],

  docFilename: resolve(appRoot, "specs/demo/swagger.yaml")
};
