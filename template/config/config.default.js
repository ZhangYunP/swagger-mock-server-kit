const path = require("path");

const appRoot = path.resolve(__dirname, "..");

const docFilename = path.resolve(appRoot, "specs/demo/swagger.yaml");

const mockhost = "localhost";

const docUIPath = "/api-docs";

const mockExtPath = path.join(appRoot, "lib/random-extend.js");

const publicPath = path.join(appRoot, "public");

const multerOptions = {
  dest: "upload/"
};

const validateRequest = true;
const validateResponse = true;

module.exports = {
  appRoot,
  docFilename,
  mockhost,
  docUIPath,
  multerOptions,
  validateRequest,
  validateResponse,
  mockExtPath,
  publicPath
};
