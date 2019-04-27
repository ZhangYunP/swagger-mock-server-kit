const fs = require("fs");
const parser = require("swagger-parser-mock");
const path = require("path");
const sway = require("sway");
const validateRquest = require("../middlewares/validate-req");

const { appRoot } = require("../config/config.default");

const {
  success,
  error: elog,
  warning,
  formatResultMessage
} = require("./utils");

const registerValidateMiddleWare = (app, api, baseUrl) => {
  app.use(baseUrl, validateRquest(api, { strictMode: false }));
};

class MockRouter {
  constructor(opts = {}) {
    this.opts = this.formatopts(opts);
    this.modStart = `
      const Mock = require('mockjs')

      module.exports = app => {
    `;
    this.hookRoute = `
        app.get('/api/foo', (req, res) => {
          res.json({
            bar: 'baz'
          })
        })
    `;
    this.modEnd = `
      }
    `;
    Object.assign(this, this.opts);
    this.dist = path.join(this.output, this.filename);
    this.api = null;
  }

  formatopts(opts) {
    if (!opts.url) throw new Error("opts.url is required");
    opts.output = opts.output || path.join(appRoot, "routes");
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
      const isValidate = await this.validateDoc({
        definition: this.url
      });

      if (!isValidate) {
        throw new Error("invalid doc file");
      }

      registerValidateMiddleWare(app, this.api, this.baseUrl);

      const paths = await this.parseDoc();

      const pathinfo = this.extractPathInfo(paths);

      const template = this.generateTemplate(pathinfo);

      this.emitFile(template, err => {
        if (err) throw err;

        this.setup(app, err => {
          if (err) throw err;
          success("[info]  ", "register mockdata router success");
        });
      });
    } catch (e) {
      elog("error: ", e);
      throw e;
    }
  }

  async parseDoc() {
    try {
      var { paths } = await parser(this.url);
    } catch (e) {
      throw e;
    }
    return paths;
  }

  extractPathInfo(paths) {
    const pathinfo = [];

    Object.keys(paths).forEach(path => {
      if (~this.blackList.indexOf(path)) return;

      Object.keys(paths[path]).forEach(method => {
        const { responses } = paths[path][method];
        if (responses && !responses["200"]) return;

        // console.log(responses["200"]);
        const { example } = responses["200"];
        pathinfo.push({
          path,
          method,
          example
        });
      });
    });
    return pathinfo;
  }

  generateTemplate(pathinfo) {
    let template = "";
    template += this.modStart;

    pathinfo.forEach(({ path, method, example }) => {
      template += `
         app.${method}('${this.baseUrl}${path.replace(
        /\{([^}]*)\}/g,
        ":$1"
      )}', (req, res) => {
           res.json(Mock.mock(${example}));
         })
       `;
    });
    template += this.hookRoute;
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

  setup(app, cb) {
    if (!fs.existsSync(this.dist)) {
      cb(new Error("not found mockroute in dist"));
    }
    const registerRoute = require(this.dist);
    registerRoute(app);
    cb(null);
  }
}

module.exports = MockRouter;
