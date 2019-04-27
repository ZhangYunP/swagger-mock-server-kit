const path = require("path");
const fs = require("fs");

const setupOwnMiddleware = (app, middlewareDir) => {
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
          const middleware = require(midPath);
          if (typeof middleware == "function") {
            app.use(middleware);
          }
          return;
        } catch (e) {
          throw e;
        }
      } else {
        setupOwnMiddleware(midPath);
      }
    });
  }
};

module.exports = setupOwnMiddleware;
