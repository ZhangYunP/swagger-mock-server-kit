const express = require("express");
const chalk = require("chalk");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const axios = require('axios')
const yaml = require("js-yaml");
const RandExp = require("randexp");
const setupMiddleware = require("./setup-middleware");
const {
  multerOptions,
  baseUrl = '/api/v1'
} = require("../config");

const log = console.log;
const upload = multer(multerOptions);
let count = 0;

const autoLoadPlugin = (dir) => {
  const plugins = []
  const appRoot = path.resolve(__dirname, "..");
  const pluginPath = path.resolve(appRoot, dir);
  if (fs.existsSync(pluginPath)) {
    const files = fs.readdirSync(pluginPath)
    files.forEach(file => {
      const current = path.join(pluginPath, file)
      plugins.push(current)
    })
  }
  return plugins
}

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
  if (config.docFilename && !path.isAbsolute(config.docFilename)) {
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
    errors.forEach(err => {
      let {
        code,
        path,
        message
      } = err;
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
  basePath = baseUrl
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
  if (!path) return true
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

  if (config.swaggerDocument) {
    app.use(
      config.docUIPath,
      swaggerUi.serve,
      swaggerUi.setup(config.swaggerDocument)
    );
  }
  
  if (config.proxy) {
    app.use(config.baseUrl, proxy(config.proxy));
  }
  
  setupMiddleware(
    app,
    config.middlewareDir || path.join(config.appRoot, "middlewares")
  );
};

const getSwaggerDocument = async (docFilename, isOnline) => {
  let swaggerDocument;
  if (!isOnline) {
    const ext = path.extname(docFilename);
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
  } else {
    const result = await axios.get(docFilename)
    if (result.status === 200) {
      swaggerDocument = result.data
    } else {
      elog(' error ', 'online swaggerDocUrl is not validate')
    }
  }
  
  return swaggerDocument;
};

const getBasePath = async (docFilename, isOnline) => {
  let doc
  if (typeof docFilename === 'string') {
    doc = await getSwaggerDocument(docFilename, isOnline);
  } else if (typeof docFilename === 'object') {
    doc = docFilename
  }
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
  autoLoadPlugin,
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
