const chalk = require('chalk')

const colorLog = color => (info, ...arg) => void console.log.call(console, chalk[color](info), ...arg)

const elog = colorLog('bgRed') 
 
const slog = colorLog('bgGreen') 

const wlog = colorLog('bgYellow') 

module.exports = {
  elog,
  slog,
  wlog
}
