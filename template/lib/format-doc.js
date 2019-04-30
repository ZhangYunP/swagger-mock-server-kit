const fs = require("fs");
const {
  extname
} = require("path");
const {
  safeDump
} = require("js-yaml");
const {
  sadd,
  isvalidatePort
} = require("./utils");

module.exports = (doc, docPath, mockhost, log) => {

  if (!doc.paths) throw new Error('doc.paths must be required, the doc is invalid')
  const paths = doc.paths

  if (!~doc.host.indexOf(":") || !isvalidatePort(doc.host.split(":")[1])) {
    doc.host = doc.host.split(":")[0] + ":" + (process.env.PROT || 12121);
  }
  if (mockhost) {
    const parts = doc.host.split(":");
    doc.host = mockhost + ":" + parts[1];
  }
  var yamldoc;
  const consumes = new Set();
  const produces = new Set();
  Object.keys(paths).forEach(path => {
    Object.keys(paths[path]).forEach(method => {
      if (paths[path][method].consumes) {
        sadd(consumes, paths[path][method].consumes);
        delete paths[path][method].consumes;
      }

      if (paths[path][method].produces) {
        sadd(produces, paths[path][method].produces);
        delete paths[path][method].produces;
      }
    });
  });
  const existsConsumes = [...(doc.consumes || []), "application/octet-stream"];
  const existsProduces = [...(doc.produces || []), "application/octet-stream"];
  sadd(consumes, existsConsumes);
  sadd(produces, existsProduces);

  log.slog("[info]  ", "accept request content-type: " + [...consumes]);
  log.slog("[info]  ", "accept response content-type: " + [...produces]);

  doc.consumes = [...consumes];
  doc.produces = [...produces];

  const ext = extname(docPath);
  try {
    if (ext === ".yaml") {
      yamldoc = safeDump(doc);

      fs.writeFileSync(docPath, yamldoc);
    } else {
      fs.writeFileSync(docPath, JSON.stringify(doc, null, 4));
    }
  } catch (e) {
    throw e
  }

  return doc;
};
