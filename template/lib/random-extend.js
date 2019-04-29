const Mock = require('mockjs')

const {
  genRegexString,
  getFixString
} = require('./utils')

Mock.Random.extend({
  regexstring(pattern, min, max) {
    let patternString = genRegexString(pattern)
    return getFixString(patternString, min, max)
  },
  xdatetime() {
    let datetime = this.date('yyyy-MM-dd') + 'T' + this.time('HH:mm:ss') + 'Z'
    return datetime
  }
})

module.exports = Mock.mock
