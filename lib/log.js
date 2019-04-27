const chalk = require("chalk");

const log = console.log;

const error = (string, metadata) => void log(chalk.red(string), metadata);

const success = (string, metadata) => void log(chalk.green(string), metadata);

const warning = (string, metadata) => void log(chalk.yellow(string), metadata);

module.exports = {
  error,
  success,
  warning
};
