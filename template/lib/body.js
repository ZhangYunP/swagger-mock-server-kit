const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { safeLoad } = require("js-yaml");
const { choice } = require("./utils");
const { docFilename } = require("../config");

// base on JSON Schema Draft 4
class Body {
  constructor(opts = {}) {
    this.opts = opts;
    this.pathInfo = [];
    this.notValidate = [];
    this.init();
  }

  init() {
    if (!fs.existsSync(docFilename))
      throw new Error("not exists file: " + docFilename);
    const ext = path.extname(docFilename);
    try {
      if (ext === ".yaml") {
        this.doc = safeLoad(fs.readFileSync(docFilename));
      } else {
        this.doc = require(docFilename);
      }
    } catch (e) {
      throw e;
    }
    this.parseDoc(this.doc);
  }

  parseDoc(doc) {
    _.each(doc.paths, (pathinfo, path) => {
      _.each(pathinfo, ({ responses = {} }, method) => {
        if (
          _.keys(responses).length !== 0 &&
          responses["200"] &&
          responses["200"].schema
        ) {
          const schema = responses["200"].schema;
          const example = this.parseSchema(schema);
          this.pathInfo.push({
            path,
            method,
            example
          });
        }
      });
    });
  }

  parseSchema(schema) {
    if (schema.$ref) {
      console.log(schema.$ref);
      this.resolveRef(schema.$ref);
    }
    switch (schema.type) {
      case "array":
        return this.generateArrayMock(schema);
      case "object":
        return this.generateObjectMock(schema);
      case "string":
        return this.generateStringMock(schema);
      case "number":
      case "integer":
        return this.generateNumberMock(schema);
      default:
        return this.generateNormalMock(schema);
    }
  }

  generateArrayMock(schema) {
    const example = [];
    const max = schema.maxItems ? schema.maxItems : 10;
    const min = schema.minItems ? schema.minItems : 1;
    const count = choice(min, max);
    const childSchema = schema.items;
    for (let i = 0; i < count; i++) {
      const childExample = this.parseSchema(childSchema);
      example.push(childExample);
    }
    return example;
  }

  generateObjectMock({ properties }) {
    const example = {};
    _.each(properties, (childSchema, prop) => {
      const childExample = this.parseSchema(childSchema);
      example[prop] = childExample;
    });
    return example;
  }

  generateStringMock(schema) {
    if (schema.example) return schema.example;
    var max = schema.maxLength ? schema.maxLength : 20;
    var min = schema.minLength ? schema.minLength : 5;
    var final = `@string("lower", ${min}, ${max})`;
    if (schema.pattern) {
      final = `@regexstring(${schema.pattern}, ${min}, ${max})`;
    } else if (schema.format) {
      const format = schema.format;
      if (format === "email") {
        final = `@email`;
      } else if (format === "url") {
        final = `@url`;
      } else if (format === "date") {
        final = `@date`;
      } else if (format === "date-time") {
        final = `@xdatetime`;
      } else if (format === "byte") {
        final = `@dataImage`;
      }
    }
    if (schema.enum) {
      final = `@pick([${schema.enum}])`;
    }
    return final;
  }

  generateNumberMock(schema) {
    const max = schema.maximum ? schema.maximum : 65535;
    const min = schema.minimum ? schema.minimum : 0;
    let final = `@integer(${min}, ${max})`;
    if (schema.format === "float" || schema.format === "double") {
      final = `@float(${min}, ${max})`;
    }
    if (schema.enum) {
      final = `@pick([${schema.enum}])`;
    }
    return final;
  }

  generateNormalMock(schema) {
    const type = schema.type;
    return "@" + type;
  }

  resolveRef(ref) {
    let root = this.doc;
    const parts = ref.split("#");
    if (!parts[0]) {
      const paths = parts[1].split("/").slice(1);
      for (let i = 0; i < paths.length; i++) {
        root = root[paths[i]];
      }
    }
  }

  mock(path, method, data) {
    let notfound = false;
    if (arguments.length === 1 && _.isArray(arguments[0])) {
      this.pathInfo = _.concat(this.pathInfo, arguments[0]);
    } else {
      notfound = _.some(this.pathInfo, val => {
        if (val.path === path && val.method === method) {
          if (_.isArray(val.example)) {
            data = _.isArray(data) ? data : [data];
            val.example.forEach(item => {
              _.assign(item, data[0]);
            });
          } else {
            data = _.isObject(data) ? data : {};
            _.assign(val.example, data);
          }
          return true;
        }
      });
      if (!notfound) {
        this.register(path, method, data);
      }
    }

    return this;
  }

  mockMulti(paths, method, datas) {
    _.each(paths, (val, key) => {
      if (datas.length === paths.length) {
        this.mock(val, method, datas[key]);
      } else if (_.isObject(datas)) {
        this.mock(val, method, datas);
      } else {
        throw new Error("mock datas is invalid");
      }
    });
  }

  register(path, method, data) {
    this.pathInfo.push({
      path,
      method,
      example: data
    });
    this.notValidate.push(path);
  }

  clear() {
    this.pathInfo = [];
    return this;
  }
}

module.exports = Body;
