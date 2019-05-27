const create = require('./scripts/create')
const spawn = require('cross-spawn')
const path = require('path')

let isInstalled = false

const startMockServer = (mockDir, options = {}) => {
  !isInstalled && create(mockDir, options)
  // spawn.sync('cd', [mockDir], { cwd: process.cwd()})
  // spawn.sync('npm', ['start'], { cwd: path.join(process.cwd(), mockDir) })
  isInstalled = true
}

module.exports = startMockServer