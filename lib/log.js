const chalk = require('chalk')

const log = console.log

const error = (string) => void log(chalk.red(string))

const success = (string) => void log(chalk.green(string))

const warning = (string) => void log(chalk.yellow(string))

module.exports = {
  error,
  success,
  warning
}
