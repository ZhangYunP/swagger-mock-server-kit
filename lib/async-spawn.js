const spawn = require("cross-spawn");
const log = require("./log");

let isfinish = false;

function asyncSpawn(name, ...rest) {
  return new Promise((resolve, reject) => {
    const child = spawn.apply(null, rest);
    child.stdout.on("data", data => {
      data = data.toString().trim();
      log.success("    [info]: ", data);
    });

    child.stderr.on("data", data => {
      log.error("error: " + data);
    });

    child.stdout.on("end", () => {
      if (!isfinish) {
        isfinish = true;
        log.success("child command " + name + " execute finish!");
        return resolve();
      }
    });

    child.on("close", code => {
      log.success("child command " + name + " close with code: " + code);
      if (isfinish) {
        return;
      }
      if (code !== 0) reject();

      isfinish = true;
      return resolve();
    });
  });
}

module.exports = asyncSpawn;
