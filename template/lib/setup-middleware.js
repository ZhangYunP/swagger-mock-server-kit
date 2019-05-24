const path = require("path");
const fs = require("fs");
const chalk = require("chalk");

const error = (string, metadata) =>
  void console.log(chalk.bgRed(string), metadata);

const success = (string, metadata) =>
  void console.log(chalk.bgGreen(string), metadata);

const setupOwnMiddleware = (app, middlewareDir) => {
  let count = 0;
  if (!fs.existsSync(middlewareDir)) {
    throw new Error("middleware dir is requied");
  }
  const stat = fs.lstatSync(middlewareDir);
  if (stat.isDirectory()) {
    const files = fs.readdirSync(middlewareDir);
    files.forEach(file => {
      const midPath = path.join(middlewareDir, file);

      const midStat = fs.lstatSync(midPath);
      if (midStat.isFile()) {
        try {
          if (~file.indexOf("middleware")) {
            const middleware = require(midPath);
            if (typeof middleware == "function") {
              app.use(middleware);
              count++;
              success(" info ", "setup middleware success!");
            }
          }
          return;
        } catch (e) {
          error(" error ", e);
          throw e;
        }
      } else {
        setupOwnMiddleware(midPath);
      }
    });
  }
  success(" info ", "own middleware number: " + count);
};

module.exports = setupOwnMiddleware;
