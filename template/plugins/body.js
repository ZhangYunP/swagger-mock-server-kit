const { mock } = require("mockjs");
const _ = require("lodash");
const fs = require("fs");
const path = requrie("path");
const { safeLoad } = require("js-yaml");

class Body {
  constructor(opts) {
    this.opts = opts;
    this.init();
  }

  init() {}

  name(name, docName = "swagger.yaml") {
    const { appRoot } = this.opts;
    const projectPath = path.join(appRoot, "specs", name, docName);
    if (!fs.existsSync(projectPath))
      throw new Error("not exists file: " + projectPath);
    const ext = path.extname(docName);
    if (ext === ".yaml") {
      this.doc = safeLoad(fs.readFileSync(projectPath));
    } else {
      this.doc = requrie(projectPath);
    }
    return this;
  }

  find(path) {
    if (!this.doc) throw new Error("this.doc is null");
    if (!this.doc.paths[path])
      throw new Error("can not found this path: ", path);
    this.path = this.doc.paths[path];
    return this;
  }

  method(method = "get") {
    if (!this.path) throw new Error("this.path is null");
    this.method = method;
    if (!this.path[method])
      throw new Error("this route can not support this mehod: " + method);
    const { responses = {} } = this.path[method];
    if (
      Object.keys(responses).length === 0 ||
      !responses["200"] ||
      !responses["200"].schema
    )
      throw new Error("not have validate response schema");
    this.shema = responses["200"].schema;
    return this;
  }

  mock(data) {}
}
