const spawn = require("cross-spawn")
const log = require('./log')

function asyncSpawn(opts, ...rest) {
  return new Promise((resolve, reject) => {
    let isfinish = false
    let result = ''
    const cmdName = opts.name || ''
    const spinner = opts.spinner
    const verbose = opts.verbose === true
    const ignoreErrorMessage = opts.ignoreErrorMessage
    const defaultOutString = opts.defaultOutString || '...'

    if (!spinner) {
      log.slog(' info ', 'will exec cmd "' + cmdName + '"')
    }

    const child = spawn.apply(null, rest);

    if (rest[2]['stdio']) {
      child.on('close', code => {
        if (!isfinish) {
          isfinish = true
          resolve()
        }
      })
    } else {
      child.stderr.on("data", data => {
        if (spinner) {
          !ignoreErrorMessage && spinner.warn("\n error " + data);
        } else {
          !ignoreErrorMessage && log.warn(' warn ', 'some error may happened, ' + data)
        }
      });
  
      child.stdout.on("data", data => {
        let outString = ''
        if (!data.toString()) {
          outString = defaultOutString
        } else {
          outString = data.toString()
        }
        if (spinner) {
          spinner.text = outString
        } else if (verbose) {
          log.slog(outString)
        }
        result += data.toString().trim();
      });
      
      child.stdout.on("end", () => {
        if (!isfinish) {
          isfinish = true;
          if (!spinner) {
            log.slog(' info ', 'cmd "' + cmdName + '"exec succeed')
          }
          resolve(result);
        }
      });
    }

    child.on('error', error => {
      if (!isfinish) {
        isfinish = true
        reject(new Error("cmd " + cmdName + " exec failed!"))
        child.kill()
      }
    })
  });

}

module.exports = asyncSpawn;
