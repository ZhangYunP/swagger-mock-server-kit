const path = require('path')
const log = require('./lib/log')
const create = require('./scripts/create')
const spawn = require('./lib/async-spawn')
const isExistMockServer = require('./lib/util')

const startMockServer = async (mockDir, options = { }) => {
  if (!isExistMockServer(mockDir)) {
    await create(mockDir, options)
  } else {
    log.slog(' info ', 'has already exist mock server , no need create mock server again')
  }
  if (options.onlyCreate) return
  await spawn(
    {
      name: 'start server', 
      ignoreErrorMessage: true,
    }, 
    'npm', 
    ['start'], 
    { 
      cwd: path.join(process.cwd(), mockDir), 
      stdio: 'inherit'
    }
  )
}

module.exports = startMockServer