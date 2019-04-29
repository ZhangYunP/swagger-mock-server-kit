const fs = require("fs");
const parser = require("swagger-parser-mock");
const path = require("path");
const sway = require("sway");
const validateRquestMiddleware = require("../middlewares/validate-http");
const Body = require('./body')
const bus = require('./event-bus')

const {
  success,
  error: elog,
  warning,
  formatResultMessage
} = require("./utils");

const {
  validateRequest,
  validateResponse,
  mockExtPath
} = require('../config')

const registerValidateMiddleWare = (app, api, baseUrl) => {
  app.use(baseUrl, validateRquestMiddleware(api, {
    strictMode: false
  }));
};

class MockRouter {
  constructor(opts = {}) {
    this.opts = this.formatopts(opts);
    const routesPath = path.join(this.opts.output)
    const mockPath = path.relative(routesPath, mockExtPath).replace(/\\/g, '/')
    this.modStart = `
      const mock = require('${mockPath}')

      module.exports = (app, api, isvalidateRes) => {
    `;
    this.modEnd = `
      }
    `;
    Object.assign(this, this.opts);
    this.dist = path.join(this.output, this.filename);
    this.api = null;
    this.body = new Body()
  }

  formatopts(opts) {
    if (!opts.url) throw new Error("opts.url is required");
    opts.output =
      opts.output || path.join(opts.appRoot || process.cwd(), "routes");
    opts.filename = opts.filename || "mockRoutes.js";
    opts.blackList = opts.blackList || [];
    opts.baseUrl = opts.baseUrl || "/api";
    return opts;
  }

  async validateDoc(swayOpts) {
    try {
      const api = await sway.create(swayOpts);
      const results = await api.validate();
      formatResultMessage(results, {
        success,
        elog,
        warning
      });
      if (results.errors.length > 0) return false;
      this.api = api;
      return true;
    } catch (e) {
      elog("error: ", e);
      return false;
    }
  }

  async init(app) {
    try {
      const isValidateDoc = await this.validateDoc({
        definition: this.url
      });

      if (!isValidateDoc) {
        throw new Error("invalid doc file");
      }

      if (validateRequest) registerValidateMiddleWare(app, this.api, this.baseUrl);

      const {
        pathInfo
      } = this.body
      // bus.emit(this.body)

      const template = this.generateTemplate(pathInfo);

      this.emitFile(template, err => {
        if (err) throw err;

        this.setup(app, validateResponse, err => {
          if (err) throw err;
          success("[info]  ", "register mockdata router success");
        });
      });
    } catch (e) {
      elog("error: ", e);
      throw e;
    }
  }

  generateTemplate(pathinfo) {
    let template = "";
    template += this.modStart;

    pathinfo.forEach(({
      path,
      method,
      example
    }) => {
      template += `
         app.${method}('${this.baseUrl}${path.replace(
        /\{([^}]*)\}/g,
        ":$1"
      )}', (req, res) => {
        if (isvalidateRes) {
          const operation = api.getOperation(req);
          const responseData = {
            body: mock(${JSON.stringify(example)}),
            statusCode: res.statusCode
          }
          const results = operation.validateResponse(responseData);
    
          if (!results.errors.length && !results.warnings.length) {
            res.json(mock(${JSON.stringify(example)}));
          } else {
            res.status(400).json({
              code: 40002,
              message: "invalidate response",
              error: results.errors
            })
          }
        } else {
            res.json(mock(${JSON.stringify(example)}));
        }
         })
       `;
    });

    template += this.modEnd;

    return template;
  }

  emitFile(tpl, cb) {
    if (typeof tpl !== "string" || !tpl) {
      cb(new Error("tpl is required"));
    }
    if (!fs.existsSync(this.output)) fs.mkdirSync(this.output);
    fs.writeFileSync(this.dist, tpl);
    cb(null);
  }

  setup(app, validateResponse, cb) {
    if (!fs.existsSync(this.dist)) {
      cb(new Error("not found mockroute in dist"));
    }
    const registerRoute = require(this.dist);
    registerRoute(app, this.api, validateResponse);
    cb(null);
  }
}

module.exports = MockRouter;
