const spawn = require("cross-spawn");
const open = require("../lib/open");

module.exports = function start(cwd, options) {
  try {
    const child = spawn.sync("npm", ["start"], {
      cwd: cwd ? cwd : process.cwd()
    });
  } catch (e) {
    throw e;
  }
  if (options.open) {
    open(options.open, err => {
      console.log("open browser!");
    });
  }
  console.log("start mock server sucess!");
  process.exit(1);
};
