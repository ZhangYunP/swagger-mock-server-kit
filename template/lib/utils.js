const express = require("express");
const chalk = require("chalk");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const yaml = require("js-yaml");
const RandExp = require("randexp");
const setupMiddleware = require("./setup-middleware");
const {
  multerOptions
} = require("../config");

const log = console.log;
const upload = multer(multerOptions);
let count = 0;

const isvalidatePort = port => {
  port = parseInt(port, 10);
  return !isNaN(port) && (port > 0 && port < 65535);
};

const removeYamlQuote = yamlfile => {
  return yamlfile.replace(/['"]/g, m => {
    count++;
    if (count > 2) {
      return "";
    }
    return m;
  });
};

const formatConfig = (config = {}) => {
  if (!config.appRoot) {
    throw new Error("appRoot is required");
  }
  config.docFilename = config.docFilename || 'swagger.yaml';
  if (!path.isAbsolute(config.docFilename)) {
    config.docFilename = path.resolve(config.appRoot, config.docFilename);
  }
  config.plugins = config.plugins || [];
  return config;
};

const tojsonPointer = path => {
  return path
    .map(part => {
      return part.replace(/\//, "~|");
    })
    .join("/");
};

const sadd = (set, data) => {
  data.forEach(d => {
    set.add(d);
  });
};

const formatResultMessage = ({
  errors,
  warnings
}, log) => {
  if (errors.length) {
    errors.forEach(error => {
      let {
        code,
        path,
        message
      } = error;
      path = "#/" + tojsonPointer(path);
      error(
        " error ",
        "apidoc error occurr at " +
        path +
        ", code: " +
        code +
        ", message: " +
        message +
        ", a json schema for swagger 2.0 API at: http://swagger.io/v2/schema.json#"
      );
    });
    error(" error ", "errors number: " + errors.length);
  }

  if (warnings.length) {
    warnings.forEach(warning => {
      const {
        code,
        path,
        message
      } = warning;
      path = "#/" + this.tojsonPointer(path);
      warning(
        "warning: ",
        "apidoc warning occurr at " +
        path +
        ", code: " +
        code +
        ", message: " +
        message
      );
    });
    warning("warning: ", "warnings number: " + warnings.length);
  }

  if (!errors.length && !warnings.length) {
    success(" info ", "validate succeed, results: errors 0, warnings 0");
  }
};

const findServerConfig = ({
  host = "",
  basePath = "/api/v1"
}) => {
  let port;
  const parts = host.split(":");
  if (!parts[1]) {
    throw new Error("port must be provided");
  }
  port = Number(parts[1]);

  return {
    port,
    baseUrl: basePath
  };
};

const notFoundFile = (path) => {
  return !fs.existsSync(path)
}

const setStaticPath = (app, staticPath, baseUrl) => {
  app.use(express.static(staticPath));
  app.use(baseUrl, express.static(path.join(staticPath, "public")));
};

const parseBody = app => {
  app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );

  app.use(bodyParser.json());
};

const parseForm = app => {
  app.use(upload.array());
};

const setupNeededMiddleware = (app, opts) => {
  opts.consumes = opts.consumes || [];
  opts.consumes.forEach(mime => {
    if (mime.indexOf("urlencoded")) {
      parseBody(app);
    } else if (mime.indexOf("form-data")) {
      parseForm(app);
    }
  });
  setStaticPath(app, opts.path, opts.baseUrl);
};

const genRegexString = regExp => {
  if (!(regExp instanceof RegExp)) regExp = new RegExp(regExp);
  return new RandExp(regExp).gen();
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
      swaggerDocument = yaml.safeLoad(fs.readFileSync(docFilename));
    } else {
      swaggerDocument = require(docFilename);
    }
  } catch (e) {
    if (e.code === 'ENOENT') {
      error(' error ', 'not doc file')
    }
    throw e
  }
  return swaggerDocument;
};

const getBasePath = docFilename => {
  const doc = getSwaggerDocument(docFilename);
  return doc.basePath;
};

const error = (string, metadata) => void log(chalk.bgRed(string), metadata);

const success = (string, metadata) => void log(chalk.bgGreen(string), metadata);

const warning = (string, metadata) => void log(chalk.bgYellow(string), metadata);

const choice = (min, max) => {
  const count = Math.max(min, Math.floor(Math.random() * max));
  return count;
};

const getFixString = (string, min, max) => {
  const length = choice(min, max);
  if (string.length < length) {
    string = string + ".".repeat(length - string.length);
  } else if (string.length > length) {
    string = string.substr(0, length);
  }
  return string;
};

const findAssets = assetPath => {
  if (!fs.existsSync(assetPath)) {
    throw new Error("can not found assetPath: " + assetPath);
  }
  const assets = [];
  const stat = fs.statSync(assetPath);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(assetPath);
    files.forEach(file => {
      const dist = path.join(assetPath, file);
      if (fs.statSync(dist).isFile()) {
        assets.push(file);
      }
    });
  }
  return assets;
};

module.exports = {
  formatConfig,
  notFoundFile,
  getSwaggerDocument,
  removeYamlQuote,
  findServerConfig,
  setupNeededMiddleware,
  formatResultMessage,
  getBasePath,
  error,
  success,
  warning,
  sadd,
  installMiddleware,
  isvalidatePort,
  genRegexString,
  choice,
  getFixString,
  findAssets
};
