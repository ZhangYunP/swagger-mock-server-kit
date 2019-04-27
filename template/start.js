const path = require("path");
const express = require("express");
const MockRouter = require("./lib/swagger-mock-gen");
const config = require("./config");
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
const { appRoot, docFilename, docUIPath } = baseconfig;

const swaggerDocument = getSwaggerDocument(docFilename);
const { port, baseUrl, consumes } = findServerConfig(swaggerDocument);

const docRelative = path.relative(appRoot, docFilename);
const docPath = docRelative.replace(/\\/, "/");

const swaggerDocUlr = `http://localhost:${port}/${docPath}`;

const app = express();
setupNeededMiddleware(app, { path: appRoot, consumes });

const mockRouter = new MockRouter({
  url: swaggerDocUlr,
  baseUrl
});

app.listen(port, async err => {
  if (err) elog("error: ", err);
  slog("[info]  ", "register mockdate router by " + docPath);

  await mockRouter.init(app);

  installMiddleware(app, {
    ...baseconfig,
    swaggerDocUlr,
    baseUrl
  });

  slog(
    "[info]  ",
    `mock server is starting at ${port}, you can get mock data on ${baseUrl}`
  );
  slog(
    "[info]  ",
    "swagger ui doc url is: http://localhost:" + port + docUIPath
  );
});

process.on("unhandledRejection", err => {
  elog("error: ", err);
  process.exit(1);
});

process.on("uncaughtException", err => {
  elog("error: ", err);
  process.exit(1);
});
