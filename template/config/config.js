const {
  resolve
} = require("path");

const appRoot = resolve(__dirname, "..");
const pluginPath = resolve(appRoot, "plugins");
const plugin = resolve(pluginPath, "random-image.js");

module.exports = {
  plugins: [plugin],
  // baseUrl: '/api/v1',
  // docFilename: resolve(appRoot, "specs/demo/swagger.yaml")
  // validateRequest: true,
  // validateResponse: true
};
