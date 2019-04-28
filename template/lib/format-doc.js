const fs = require('fs')
const {
  sadd,
  isvalidatePort
} = require('./utils')

module.exports = (doc, docPath, mockhost, log) => {
  const {
    paths
  } = doc
  if (!~doc.host.indexOf(':') || !isvalidatePort(doc.host.split(":")[1])) {
    doc.host = doc.host.split(":")[0] + ":" + (process.env.PROT || 12121)
  }
  if (mockhost) {
    const parts = doc.host.split(":")
    doc.host = mockhost + ":" + parts[1]
  }


  const consumes = new Set()
  const produces = new Set()
  Object.keys(paths).forEach(path => {
    Object.keys(paths[path]).forEach(method => {
      if (paths[path][method].consumes) {
        sadd(consumes, paths[path][method].consumes)
        delete paths[path][method].consumes
      }

      if (paths[path][method].produces) {
        sadd(produces, paths[path][method].produces)
        delete paths[path][method].produces
      }
    })
  })

  log.slog("[info]  ", 'path consumes: ' + [...consumes])
  log.slog("[info]  ", 'path produces: ' + [...produces])
  const existsConsumes = [...(doc.consumes || []), "application/octet-stream"]
  const existsProduces = [...(doc.produces || []), "application/octet-stream"]

  sadd(consumes, existsConsumes)
  sadd(produces, existsProduces)

  log.slog("[info]  ", 'consumes: ' + [...consumes])
  log.slog("[info]  ", 'produces: ' + [...produces])

  doc.consumes = [...consumes]
  doc.produces = [...produces]
  fs.writeFileSync(docPath, JSON.stringify(doc, null, 4))
  return doc
}
