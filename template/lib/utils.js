const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");

const log = console.log;

const formatConfig = (config = {}) => {
  if (!config.appRoot) {
    throw new Error("appRoot is required");
  }
  config.docFilename = config.docFilename || "swagger.yaml";
  if (!path.isAbsolute(config.docFilename)) {
    config.docFilename = path.resolve(config.appRoot, config.docFilename);
  }
  config.docUIPath = config.docUIPath || "/api-docs";
  return config;
};

const findServerConfig = ({ host = "", basePath = "/api/v1" }) => {
  let port;
  const parts = host.split(":");
  if (parts[1]) {
    port = Number(parts[1]);
  } else {
    port = process.env.PORT || 12121;
  }
  return {
    port,
    baseUrl: basePath
  };
};

const installMiddleware = (app, config) => {
  app.use(express.static(config.appRoot));
  app.use(cors());
  app.use(
    config.docUIPath,
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerUrl: config.swaggerDocUlr
    })
  );
  if (config.proxyConfig) {
    app.use(config.baseUrl, proxy(config.proxyConfig));
  }
};

const getSwaggerDocument = docFilename => {
  const ext = path.extname(docFilename);
  let swaggerDocument;

  try {
    if (ext === ".yaml") {
      const yaml = require("yamljs");
      swaggerDocument = yaml.load(docFilename);
    } else {
      swaggerDocument = require(docFilename);
    }
  } catch (e) {
    throw e;
  }
  return swaggerDocument;
};

const error = (string, metadata) => void log(chalk.red(string), metadata);

const success = (string, metadata) => void log(chalk.green(string), metadata);

const warning = (string, metadata) => void log(chalk.yellow(string), metadata);

module.exports = {
  formatConfig,
  getSwaggerDocument,
  findServerConfig,
  error,
  success,
  warning,
  installMiddleware
};
