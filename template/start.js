const path = require("path");
const express = require("express");
const MockRouter = require("./lib/swagger-mock-gen");
const config = require("./config/config");
const {
  formatConfig,
  getSwaggerDocument,
  findServerConfig,
  success: slog,
  error: elog,
  installMiddleware
} = require("./lib/utils");

const baseconfig = formatConfig(config);
const { appRoot, docFilename, docUIPath } = baseconfig;

const swaggerDocument = getSwaggerDocument(docFilename);
const { port, baseUrl } = findServerConfig(swaggerDocument);

const docRelative = path.relative(appRoot, docFilename);
const docPath = docRelative.replace(/\\/, "/");

const swaggerDocUlr = `http://localhost:${port}/${docPath}`;

const app = express();
const mockRouter = new MockRouter({
  url: swaggerDocUlr,
  baseUrl
});

installMiddleware(app, {
  ...baseconfig,
  swaggerDocUlr,
  baseUrl
});

app.listen(port, async err => {
  if (err) elog("error: ", err);
  slog("register mockdate router by swagger.yaml");
  await mockRouter.init(app);
  slog(
    `mock server is starting at ${port}, you can get mock data on ${baseUrl}`
  );
  slog("swagger ui doc url is: http://localhost:" + port + docUIPath);
});

process.on("unhandledRejection", err => {
  elog("error: ", err);
  process.exit(1);
});

process.on("uncaughtException", err => {
  elog("error: ", err);
  process.exit(1);
});
