const create = require('./scripts/create')
const spawn = require('cross-spawn')

const isInstalled = false

const startMockServer = (mockDir, options = {}) => {
  !isInstalled && create(mockDir, options) && (isInstalled = true)
  spawn.sync('cd', [mockDir], { cwd: process.cwd()})
  spawn.sync('npm', ['start'], { cwd: path.join(process.cwd(), mockDir) })
}

module.exports = startMockServer