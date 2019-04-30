const Mock = require('mockjs')

const {
  genRegexString,
  getFixString,
  getBasePath,
  findAssets,
  notFoundFile,
  baseUrl
} = require('./utils')

const {
  docFilename = '',
    publicPath
} = require('../config')

const notDoc = notFoundFile(docFilename)

const basePath = notDoc === true ? baseUrl : getBasePath(docFilename)
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

module.exports = Mock.mock
