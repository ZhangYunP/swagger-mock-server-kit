const fs = require('fs')

const isExistMockServer = dir => {
  const exist = fs.existsSync(dir)
  let node_modules_dir = false
  let bootstrap_file = false

  if (exist) {
    const files = fs.readdirSync(dir)
    for (let file of files) {
      if (file.indexOf('node_modules') > -1) {
        node_modules_dir = true
      }
      if (file.indexOf('start.js') > -1) {
        bootstrap_file = true
      }
      if (node_modules_dir && bootstrap_file) {
        return true
      }
    }
  }
  return false
}

module.exports = isExistMockServer