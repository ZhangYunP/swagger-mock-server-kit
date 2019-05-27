const {
  resolve
} = require("path");

const appRoot = resolve(__dirname, "..");
const pluginPath = resolve(appRoot, "plugins");
const plugin = resolve(pluginPath, "plugin-example.js");

module.exports = {
  plugins: [plugin],
  // baseUrl: '/api/v1',
  docFilename: resolve(appRoot, "specs/demo/swagger.json"),
  validateDoc: false,
  // validateRequest: false,
  // validateResponse: false,
  // proxy: {
  //   target: 'http://localhost:1234/',
  //   changeOrigin: true
  // },
  // wirteDocToLocal: false
  // online: 'http://192.168.10.99:8083/manage/v2/api-docs'
};
