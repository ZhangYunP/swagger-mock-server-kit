const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");
const rimraf = require("rimraf");
const util = require("util");
const asyncSpawn = require("../lib/async-spawn");
const log = require("../lib/log");

const { root } = require("../config");

const clean = util.promisify(rimraf);

let spawnCmd;

function create(projectName = "swagger-mock-server", options) {
  (async () => {
    try {
      log.slog(
        " info ",
        "execute create command, [projectName]: " +
          projectName +
          ", [--yarn]: " +
          (options.yarn ? options.yarn : "false")
      );
  
      const distDir = path.join(process.cwd(), projectName);
      if (fs.existsSync(distDir)) {
        await clean(distDir);
        log.slog(" info ", "delete distDir success");
      }
      fs.mkdirSync(distDir);
  
      const sourceDir = path.join(root, "template");
  
      log.slog(
        " info ",
        "template path is: " + sourceDir + ", and will copy to " + distDir
      );
  
      if (!fs.existsSync(sourceDir)) {
        throw new Error("source dir must be existed");
      }
  
      await fs.copy(sourceDir, distDir);
  
      log.slog(" info ", "copy template to distDir success!");
      await installDeps(options, distDir);
      log.slog(" info ", "create project success!");
      process.exit(0);
    } catch (e) {
      log.elog(' error ', e.message)
      process.exit(1)
    }
  })();
}

async function installDeps(options, cwd = process.cwd()) {
  if (options.yarn) {
    spawnCmd = "yarn";
  } else {
    spawnCmd = "npm";
  }

  var spinner = ora("now install dependences , please wait...").start();

  await asyncSpawn(
    {
      name: 'install-dependences'
    },
    spawnCmd,
    ["install"],
    {
      cwd
    }
  );

  spinner.stop();
  spinner.succeed("project dependences install succeed!");

}

module.exports = create;
