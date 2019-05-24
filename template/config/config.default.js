const path = require("path");

const appRoot = path.resolve(__dirname, "..");

const mockhost = "localhost";

const docUIPath = "/api-docs";

const defaultPort = 10101

const mockExtPath = path.join(appRoot, "lib/random-extend.js");

const publicPath = path.join(appRoot, "public");

const multerOptions = {
  dest: "upload/"
};

const validateRequest = true;
const validateResponse = true;

module.exports = {
  appRoot,
  defaultPort,
  mockhost,
  docUIPath,
  multerOptions,
  validateRequest,
  validateResponse,
  mockExtPath,
  publicPath
};
