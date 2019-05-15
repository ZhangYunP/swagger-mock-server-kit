const spawn = require("cross-spawn");
const log = require('../lib/log')

module.exports = function start(cwd, options) {
  log.slog('run start command')
  try {
    const child = spawn.sync("npm", ["start"], {
      cwd: cwd ? cwd : process.cwd(),
      stdio: 'inherit'
    });
  } catch (e) {
    log.elog(e)
    throw e;
  }
};
