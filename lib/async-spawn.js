const spawn = require("cross-spawn");

let isfinish = false;

function asyncSpawn(opts, ...rest) {
  return new Promise((resolve, reject) => {
    let result = ''
    const cmdName = opts.name || ''
    const spinner = opts.spinner
    const defaultOutString = opts.defaultOutString || '...'

    const child = spawn.apply(null, rest);

    if (rest.includes('stdio')) {
      child.on('close', code => {
        if (!isfinish) {
          isfinish = true
          resolve()
        }
      })
    } else {
      child.stderr.on("data", data => {
        !opts.ignoreErrorMessage && spinner && spinner.warn("\n error " + data);
      });
  
      child.stdout.on("data", data => {
        let outString = ''
        if (!data.toString()) {
          outString = defaultOutString
        } else {
          outString = data.toString()
        }
        spinner && (spinner.text = outString)
        result += data.toString().trim();
      });
      
      child.stdout.on("end", () => {
        if (!isfinish) {
          isfinish = true;
          resolve(result);
        }
      });
    }

    child.on('error', error => {
      if (!isfinish) {
        isfinish = true
        reject(new Error("command " + cmdName + " execute failed!"))
        child.kill()
      }
    })
  });

}

module.exports = asyncSpawn;
