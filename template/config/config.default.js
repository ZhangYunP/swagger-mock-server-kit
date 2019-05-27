const path = require("path");
const { autoLoadPlugin } = require('../lib/utils')

const appRoot = path.resolve(__dirname, "..");

const mockhost = "localhost";

const docUIPath = "/api-docs";

const defaultPort = 10101

const mockExtPath = path.join(appRoot, "lib/random-extend.js");

const publicPath = path.join(appRoot, "public");

const multerOptions = {
  dest: "upload/"
};
const validateDoc = true;
const validateRequest = true;
const validateResponse = true;

const docPlaceWhere = path.resolve(appRoot, "specs/demo/swagger.json")
const wirteDocToLocal = true


const plugins = autoLoadPlugin("plugins")

module.exports = {
  appRoot,
  defaultPort,
  mockhost,
  docUIPath,
  multerOptions,
  validateRequest,
  validateResponse,
  mockExtPath,
  publicPath,
  validateDoc,
  docPlaceWhere,
  wirteDocToLocal,
  plugins
};
