const spawn = require("cross-spawn");
const log = require("./log");

let isfinish = false;

function asyncSpawn(opts, ...rest) {
  return new Promise((resolve, reject) => {
    let result = ''
    const cmdName = opts.name || ''
    const verbose = opts.debug !== false
    if (!verbose) {
      log.elog = () => void 0
      log.slog = () => void 0
    }
    const child = spawn.apply(null, rest);

    child.stdout.on("data", data => {
      result += data.toString().trim();
    });
    
    child.stdout.on("end", () => {
      if (!isfinish) {
        isfinish = true;
        log.slog("\n info ", "child command " + cmdName + " execute finished!");
        resolve(result);
      }
    });

    child.on('error', error => {
      reject(new Error("child command " + cmdName + " execute failed!"))
      child.kill()
    })
  });
}

module.exports = asyncSpawn;
