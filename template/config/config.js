const {
  resolve
} = require("path");

const appRoot = resolve(__dirname, "..");

module.exports = {
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
