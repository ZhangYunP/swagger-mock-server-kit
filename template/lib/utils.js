const express = require("express");
const chalk = require("chalk");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const setupMiddleware = require("./setup-middleware");
const { multerOptions } = require("../config");

const log = console.log;
const upload = multer(multerOptions);

const formatConfig = (config = {}) => {
  if (!config.appRoot) {
    throw new Error("appRoot is required");
  }
  config.docFilename = config.docFilename || "swagger.yaml";
  if (!path.isAbsolute(config.docFilename)) {
    config.docFilename = path.resolve(config.appRoot, config.docFilename);
  }
  config.docUIPath = config.docUIPath || "/api-docs";
  config.plugins = config.plugins || [];
  return config;
};

tojsonPointer = path => {
  return path
    .map(part => {
      return part.replace(/\//, "~|");
    })
    .join("/");
};

formatResultMessage = ({ errors, warnings }, log) => {
  if (errors.length) {
    errors.forEach(error => {
      let { code, path, message } = error;
      path = "#/" + tojsonPointer(path);
      log.elog(
        "error: ",
        "apidoc error occurr at " +
          path +
          ", errcode: " +
          code +
          ", errormessage: " +
          message
      );
    });
    log.elog("error: ", "errors number: " + errors.length);
  }

  if (warnings.length) {
    warnings.forEach(warning => {
      const { code, path, message } = warning;
      path = "#/" + this.tojsonPointer(path);
      log.warning(
        "warning: ",
        "apidoc warning occurr at " +
          path +
          ", errcode: " +
          code +
          ", errormessage: " +
          message
      );
    });
    log.warning("warning: ", "warnings number: " + warnings.length);
  }

  if (!errors.length && !warnings.length) {
    log.success("[info]  ", "validate succeed, results: errors 0, warnings 0");
  }
};

const findServerConfig = ({ host = "", basePath = "/api/v1", consumes }) => {
  let port;
  const parts = host.split(":");
  if (parts[1]) {
    port = Number(parts[1]);
  } else {
    port = process.env.PORT || 12121;
  }
  return {
    port,
    baseUrl: basePath,
    consumes
  };
};

const setStaticPath = (app, path) => {
  app.use(express.static(path));
};

const setParseBody = app => {
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(bodyParser.json());
};

const setParseForm = app => {
  app.use(upload.array());
};

const setupNeededMiddleware = (app, opts) => {
  opts.consumes.forEach(mime => {
    if (mime.indexOf("urlencoded")) {
      setParseBody(app);
    } else if (mime.indexOf("form-data")) {
      setParseForm(app);
    }
  });
  setStaticPath(app, opts.path);
};

const installMiddleware = (app, config) => {
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
  setupMiddleware(
    app,
    config.middlewareDir || path.join(config.appRoot, "middlewares")
  );
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
  setupNeededMiddleware,
  formatResultMessage,
  error,
  success,
  warning,
  installMiddleware
};
