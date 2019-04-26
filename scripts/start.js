const spawn = require("cross-spawn");

module.exports = function start(cwd, options) {
  console.log('run start command')
  try {
    const child = spawn.sync("npm", ["start"], {
      cwd: cwd ? cwd : process.cwd(),
      stdio: 'inherit'
    });
  } catch (e) {
    throw e;
  }
};
