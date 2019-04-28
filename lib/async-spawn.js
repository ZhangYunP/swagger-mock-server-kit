<<<<<<< HEAD
const spawn = require('cross-spawn')
const log = require('./log')
=======
const spawn = require("cross-spawn");
const log = require("./log");
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc

let isfinish = false;

function asyncSpawn(name, ...rest) {
  return new Promise((resolve, reject) => {
<<<<<<< HEAD
    const child = spawn.apply(null, rest)
    child.stdout.on('data', data => {
      data = data.toString().trim()
      log.success('    ' + data)
    })

    child.stderr.on('data', data => {
      log.warning("error: " + data)
    })
=======
    const child = spawn.apply(null, rest);
    child.stdout.on("data", data => {
      data = data.toString().trim();
      log.success("    [info]: ", data);
    });

    child.stderr.on("data", data => {
      log.error("error: " + data);
    });
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc

    child.stdout.on("end", () => {
      if (!isfinish) {
<<<<<<< HEAD
        isfinish = true
        log.success('child command ' + name + ' execute finish!')
        return resolve()
=======
        isfinish = true;
        log.success("[info]  ", "child command " + name + " execute finish!");
        return resolve();
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc
      }
    });

<<<<<<< HEAD
    child.on('close', code => {
      log.success('child command ' + name + ' close with code: ' + code)
=======
    child.on("close", code => {
      log.success(
        "[info]  ",
        "child command " + name + " close with code: " + code
      );
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc
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
