const spawn = require("cross-spawn");
const log = require('../lib/log')

module.exports = function start(cwd, options) {
  log.success('run start command')
  try {
    const child = spawn.sync("npm", ["start"], {
      cwd: cwd ? cwd : process.cwd(),
      stdio: 'inherit'
    });
  } catch (e) {
    log.error(e)
    throw e;
  }
};
