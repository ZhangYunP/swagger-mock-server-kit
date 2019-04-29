const path = require("path");
const express = require("express");
const MockRouter = require("./lib/swagger-mock-gen");
const formatDoc = require('./lib/format-doc')
const config = require("./config");
const preparePlugin = require('./lib/setup-plugins')

const {
  formatConfig,
  getSwaggerDocument,
  findServerConfig,
  setupNeededMiddleware,
  success: slog,
  error: elog,
  installMiddleware
} = require("./lib/utils");

const baseconfig = formatConfig(config);
const {
  appRoot,
  docFilename,
  docUIPath,
  mockhost,
  plugins
} = baseconfig;

let swaggerDocument = getSwaggerDocument(docFilename);

swaggerDocument = formatDoc(swaggerDocument, docFilename, mockhost, {
  slog,
  elog
})

const {
  port,
  baseUrl,
  consumes
} = findServerConfig(swaggerDocument);

const docRelative = path.relative(appRoot, docFilename);
const docPath = docRelative.replace(/\\/, "/");

const swaggerDocUlr = `http://localhost:${port}/${docPath}`;

const app = express();

setupNeededMiddleware(app, {
  path: appRoot,
  baseUrl,
  consumes
});

const mockRouter = new MockRouter({
  url: swaggerDocUlr,
  baseUrl,
  appRoot,
  plugins
});

var removePlugin
app.listen(port, async err => {
  if (err) elog("error: ", err);
  slog("[info]  ", "register mockdate router, using " + docPath);

  await mockRouter.init(app);

  installMiddleware(app, {
    ...baseconfig,
    swaggerDocUlr,
    baseUrl
  });

  removePlugin = preparePlugin()

  slog(
    "[info]  ",
    "swagger ui doc url is: http://localhost:" + port + docUIPath
  );

  slog(
    "[success]  ",
    `mock server is starting at ${port}, you can get mock data on ${baseUrl}`
  );
});

process.on("unhandledRejection", err => {
  elog("error: ", err);
  removePlugin()
  process.exit(1);
});

process.on("uncaughtException", err => {
  elog("error: ", err);
  removePlugin()
  process.exit(1);
});
