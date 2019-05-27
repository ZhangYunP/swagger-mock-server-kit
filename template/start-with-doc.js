const path = require("path");
const axios = require('axios');
const fs = require('fs')
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

module.exports = async (app, baseconfig) => {
  let {
    appRoot,
    docFilename,
    docUIPath,
    mockhost,
    plugins,
    online,
    wirteDocToLocal,
    docPlaceWhere
  } = baseconfig;
  let swaggerDocUrl = ''
  let swaggerDocument = {}

  if (online) {
    const result = await axios.get(online)
    if (result.status === 200) {
      swaggerDocument = result.data
      slog(' info ', 'get online swagger doc at ' + online)
   
    } else {
      elog(' error ', 'online swaggerDocUrl is not validate')
    }
  } else if (docFilename) {
    swaggerDocument = await getSwaggerDocument(docFilename);
  }

  const formatDocument = formatDoc(swaggerDocument, docFilename, mockhost, {
    slog,
    elog
  })

  if (online && wirteDocToLocal) {
    fs.writeFileSync(docPlaceWhere, JSON.stringify(formatDocument, null, 2)) 
    slog(' info ', `write online doc to local`)
  }

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

  if (online && wirteDocToLocal) {
    const docRelative = path.relative(appRoot, docPlaceWhere);
    const docPath = docRelative.replace(/\\/g, "/");
    swaggerDocUrl = `http://localhost:${nowPort}/${docPath}`;
  } else if (online) {
    swaggerDocUrl = online
  } else { 
    const docRelative = path.relative(appRoot, docFilename);
    const docPath = docRelative.replace(/\\/g, "/");
    swaggerDocUrl = `http://localhost:${nowPort}/${docPath}`;
  }

  slog(' info ', `swaggerDocUrl ${swaggerDocUrl}`)

  setupNeededMiddleware(app, {
    path: appRoot,
    baseUrl,
    consumes
  });

  const mockRouter = new MockRouter({
    url: swaggerDocUrl,
    swaggerDocument: formatDocument, 
    baseUrl,
    appRoot,
    plugins
  });

  const removePlugin = preparePlugin()

  app.listen(nowPort, async err => {
    if (err) elog(" error ", err);

    slog(" info ", "register mockdate router");
    await mockRouter.init(app);

    installMiddleware(app, {
      ...baseconfig,
      swaggerDocument: formatDocument,
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
