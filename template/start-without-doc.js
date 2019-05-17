const FallbackPort = require('fallback-port')
const MockRouter = require("./lib/swagger-mock-gen");
const preparePlugin = require('./lib/setup-plugins')
const {
  setupNeededMiddleware,
  success: slog,
   error: elog,
  installMiddleware
} = require("./lib/utils");

module.exports = (app, baseconfig) => {
  const {
    appRoot,
    baseUrl,
    plugins,
    defaultPort
  } = baseconfig;

  const fallbackPort = new FallbackPort(defaultPort)
  const nowPort = fallbackPort.getPort()
  if (defaultPort !== nowPort) {
    slog(' info ', `port ${defaultPort} is taken and fallback port ${nowPort}`)
  }

  setupNeededMiddleware(app, {
    path: appRoot,
    baseUrl,
  });

  const mockRouter = new MockRouter({
    baseUrl,
    appRoot,
    plugins,
    hasSwaggerDoc: false
  });

  const removePlugin = preparePlugin()

  app.listen(nowPort, async err => {
    if (err) elog(" error ", err);

    slog(" info ", "register mockdate router without doc file, you can write plugin make mock data ");
    await mockRouter.init(app);

    installMiddleware(app, {
      ...baseconfig,
      baseUrl
    });

    slog(
      " success ",
      `mock server is starting at ${nowPort}, you can get mock data on ${baseUrl}`
    );
  });

  return removePlugin
}
