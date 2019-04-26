const spawn = require('cross-spawn')

let isfinish = false

function asyncSpawn(name, ...rest) {
  return new Promise((resolve, reject) => {
    const child = spawn.apply(null, rest)
    child.stdout.on('data', data => {
      data = data.toString().trim()
      console.log('    ' + data)
    })

    child.stderr.on('data', data => {
      console.log("error: " + data)
    })

    child.stdout.on('end', () => {
      if (!isfinish) {
        isfinish = true
        console.log('child command ' + name + ' execute finish!')
        return resolve()
      }
    })

    child.on('close', code => {
      console.log('child command ' + name + ' close with code: ' + code)
      if (isfinish) {
        return
      }
      if (code !== 0) reject()

      isfinish = true
      return resolve()
    })
  })
}

module.exports = asyncSpawn
