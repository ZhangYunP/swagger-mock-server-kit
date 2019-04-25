const path = require("path");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const proxy = require("http-proxy-middleware");
const MockRouter = require("./lib/swagger-mock-gen");
const errHandler = require("./middlewares/error-handler");
const config = require("./config/config");
const { findServerConfig } = require("./lib/utils");
const {
  appRoot,
  docFilename = "swagger.yaml",
  docUIPath = "/api-docs"
} = config;

if (!appRoot) {
  throw new Error("appRoot is required");
}

const ext = path.extname(docFilename);
let swaggerDocument;

if (ext === ".yaml") {
  const yaml = require("yamljs");
  swaggerDocument = yaml.load(docFilename);
} else {
  swaggerDocument = require(docFilename);
}

const docRelative = path.relative(appRoot, docFilename);
const docPath = docRelative.replace(/\\/, "/");

const { port, baseUrl } = findServerConfig(swaggerDocument);
const swaggerDocUlr = `http://localhost:${port}/${docPath}`;

const app = express();
const mockRouter = new MockRouter({
  url: swaggerDocUlr,
  baseUrl
});

app.use(express.static(path.join(__dirname, ".")));
app.use(baseUrl, cors());
if (config.proxyConfig) {
  app.use(baseUrl, proxy(proxyConfig));
}
app.use(errHandler);

app.listen(port, async err => {
  if (err) console.log(err);
  console.log("register mockdate router by swagger.yaml");
  await mockRouter.init(app);
  console.log(
    `mock server is starting at ${port}, you can get mock data on ${baseUrl}`
  );
  app.use(
    docUIPath,
    swaggerUi.serve,
    swaggerUi.setup(null, {
      swaggerUrl: swaggerDocUlr
    })
  );
  console.log("swagger ui doc url is: http://localhost:" + port + docUIPath);
});

process.on("unhandledRejection", err => {
  console.log(err);
  process.exit(1);
});

process.on("uncaughtException", err => {
  console.log(err);
  process.exit(1);
});
