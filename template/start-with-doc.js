const path = require("path");
const FallbackPort = require('fallback-port')
const MockRouter = require("./lib/swagger-mock-gen");
const formatDoc = require('./lib/format-doc')
const preparePlugin = require('./lib/setup-plugins')
const {
  getSwaggerDocument,
  findServerConfig,
  setupNeededMiddleware,
  success: slog,
  error: elog,
  installMiddleware
} = require("./lib/utils");

module.exports = (app, baseconfig) => {
  const {
    appRoot,
    docFilename,
    docUIPath,
    mockhost,
    plugins
  } = baseconfig;

  const swaggerDocument = getSwaggerDocument(docFilename);

  const formatDocument = formatDoc(swaggerDocument, docFilename, mockhost, {
    slog,
    elog
  })

  const {
    port,
    baseUrl,
    consumes = []
  } = findServerConfig(formatDocument);

  const fallbackPort = new FallbackPort(port)
  const nowPort = fallbackPort.getPort()
  if (port !== nowPort) {
    slog(' info ', `port ${port} is taken and fallback port ${nowPort}`)
  }
  const docRelative = path.relative(appRoot, docFilename);
  const docPath = docRelative.replace(/\\/g, "/");
  const swaggerDocUlr = `http://localhost:${nowPort}/${docPath}`;

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


  const removePlugin = preparePlugin()

  app.listen(nowPort, async err => {
    if (err) elog(" error ", err);

    slog(" info ", "register mockdate router, using " + docPath);
    await mockRouter.init(app);

    installMiddleware(app, {
      ...baseconfig,
      swaggerDocUlr,
      baseUrl
    });

    slog(
      " info ",
      "swagger ui doc url is: http://localhost:" + nowPort + docUIPath
    );

    slog(
      " success ",
      `mock server is starting at ${nowPort}, you can get mock data on ${baseUrl}`
    );
  });

  return removePlugin
}
