const chalk = require('chalk')

const log = console.log

const findServerConfig = ({
  host = "",
  basePath = "/api/v1"
}) => {
  let port;
  const parts = host.split(":");
  if (parts[1]) {
    port = Number(parts[1]);
  } else {
    port = process.env.PORT || 12121;
  }
  return {
    port,
    baseUrl: basePath
  };
};

const error = (string) => void log(chalk.red(string))

const success = (string) => void log(chalk.green(string))

const warning = (string) => void log(chalk.yellow(string))

module.exports = {
  findServerConfig,
  error,
  success,
  warning
};