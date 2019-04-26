const fs = require("fs");
const parser = require("swagger-parser-mock");
const path = require("path");
const sway = require("sway");

const {
  appRoot
} = require('../config/config')

const {
  success,
  error: elog,
  warning: wlog
} = require('./utils')

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
      const {
        errors,
        warnings
      } = await api.validate();
      if (errors.length) {
        errors.forEach(error => {
          let {
            code,
            path,
            message
          } = error;
          path = "#/" + this.tojsonPointer(path);
          elog(
            "apidoc error occurr at " +
            path +
            ", errcode: " +
            code +
            ", errormessage: " +
            message
          );
        });
        elog("errors number: " + errors.length);
        return false
      }

      if (warnings.length) {
        warnings.forEach(warning => {
          const {
            code,
            path,
            message
          } = warning;
          path = "#/" + this.tojsonPointer(path);
          wlog(
            "apidoc warning occurr at " +
            path +
            ", errcode: " +
            code +
            ", errormessage: " +
            message
          );
        });
        wlog("warnings number: " + warnings.length);
      }

      if (!errors.length && !warnings.length) {
        success("validate results: errors 0, warnings 0");
      }
      this.api = api;
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  tojsonPointer(path) {
    return path.map(part => {
      return part.replace(/\//, '~|')
    }).join('/')
  }

  async init(app) {
    try {
      const isValidate = await this.validateDoc({
        definition: this.url
      });

      if (!isValidate) {
        throw new Error("invalid doc file");
      }
      const paths = await this.parseDoc();

      const pathinfo = this.extractPathInfo(paths);

      const template = this.generateTemplate(pathinfo);

      this.emitFile(template, err => {
        if (err) throw err;

        this.setup(app, err => {
          if (err) throw err;
          success("register mockdata router success");
        });
      });
    } catch (e) {
      throw e;
    }
  }

  async parseDoc() {
    try {
      var {
        paths
      } = await parser(this.url);
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
        const {
          responses
        } = paths[path][method];
        if (responses && !responses["200"]) return;

        const schema = this.findResponseSchema(responses['200'])
        const example = this.createExample(schema)

        console.log(responses['200'])
        pathinfo.push({
          path,
          method
        });
      });
    });
    return pathinfo;
  }

  findResponseSchema(res) {
    for (var item in res) {
      if (item === 'schema') return res[item]
      if (res[item] && typeof res[item] === 'object') return this.findResponseSchema(res[item])
    }
  }

  createExample(schema) {
    let example
    switch (schema.type) {
      case 'array':
        this.generateArrayItem(schema, example)
    }

    return example
  }

  generateArrayItem(schema, example) {
    let max = schema['x-swagger-maxItems'] ? schema['x-swagger-maxItems'] : 5
    let min = schema['x-swagger-minItems'] ? schema['x-swagger-minItems'] : 1
    const count = Math.max(min, Math.floor(Math.random() * max))
    const {
      items
    } = schmea
    createExample(items)
  }

  generateObject(schema, example) {

  }

  generateString(schema, example) {

  }

  generagteNumber(schema, example) {

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
