const path = require("path");

const appRoot = path.resolve(__dirname, "..");

const docFilename = path.resolve(appRoot, "specs/swagger.yaml");

const docUIPath = "/api-docs";

module.exports = {
  appRoot,
  docFilename,
  docUIPath
};
