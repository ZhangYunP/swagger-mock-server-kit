const Mock = require('mockjs')

const {
  genRegexString,
  getFixString,
  getBasePath,
  findAssets,
  notFoundFile,
} = require('./utils')

const {
  docFilename = '',
  online,
  publicPath,
  baseUrl = '/api/v1'
} = require('../config');

(async () => {
  const notDoc = notFoundFile(docFilename) && !online

  const basePath = notDoc === true ?
    baseUrl: online ?
      await getBasePath(online, true): await getBasePath(docFilename, false)
      
  const assets = findAssets(publicPath)

  Mock.Random.extend({
    regexstring(pattern, min, max) {
      let patternString = genRegexString(pattern)
      return getFixString(patternString, min, max)
    },
    xdatetime() {
      let datetime = this.date('yyyy-MM-dd') + 'T' + this.time('HH:mm:ss') + 'Z'
      return datetime
    },
    ximage(filename) {
      if (filename) return `${basePath}/${filename}`
      const fileNumbers = assets.length
      const rand = Math.floor(Math.random() * fileNumbers)
      const img = assets[rand]
      return `${basePath}/${img}`
    }
  })
})()

module.exports = Mock.mock
