const path = require("path");

const appRoot = path.resolve(__dirname, "..");

const docFilename = path.resolve(appRoot, "specs/swagger.json");

const docUIPath = "/api-docs";

const multerOptions = {
  dest: "upload/"
};

module.exports = {
  appRoot,
  docFilename,
  docUIPath,
  multerOptions
};
