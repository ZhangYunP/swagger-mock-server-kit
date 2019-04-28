const fs = require("fs-extra");
const path = require("path");
<<<<<<< HEAD
const ora = require('ora')
const rimraf = require('rimraf')
const util = require("util")
const log = require('../lib/log')
const asyncSpawn = require('../lib/async-spawn')
=======
const ora = require("ora");
const rimraf = require("rimraf");
const util = require("util");
const asyncSpawn = require("../lib/async-spawn");
const log = require("../lib/log");
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc

const { root } = require("../config");

const clean = util.promisify(rimraf);

let spawnCmd;

function create(projectName = "swagger-mock-server", options) {
  (async () => {
<<<<<<< HEAD
    log.success("execute create command, and projectName: " + projectName + ', useYarn: ' + options.yarn)

    const distDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(distDir)) {
      await clean(distDir)
      log.success('delete distDir succeed')
=======
    log.success(
      "[info]  ",
      "execute create command, [projectName]: " +
        projectName +
        ", [--yarn]: " +
        options.yarn
        ? options.yarn
        : "false"
    );

    const distDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(distDir)) {
      await clean(distDir);
      log.success("[info]  ", "delete distDir succeed");
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc
    }
    fs.mkdirSync(distDir);

    const sourceDir = path.join(root, "template");

<<<<<<< HEAD
    log.success('template path is: ' + sourceDir, ", and will copy to " + distDir)
=======
    log.success(
      "[info]  ",
      "template path is: " + sourceDird + ", and will copy to " + distDir
    );
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc

    if (!fs.existsSync(sourceDir)) {
      throw new Error("source dir must be exists");
    }
    try {
      await fs.copy(sourceDir, distDir);
    } catch (e) {
      log.error(e)
      throw e;
    }

<<<<<<< HEAD
    log.success('copy succeed!')
=======
    log.success("[info]  ", "copy template to distDir succeed!");
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc
    await installDeps(options, distDir);
  })();
}

async function installDeps(options, cwd = process.cwd()) {
  if (options.yarn) {
    spawnCmd = "yarn";
  } else {
    spawnCmd = "npm";
  }
  try {
    var spinner = ora("now install dependences , please wait...").start();

    await asyncSpawn("installDeps", spawnCmd, ["install"], {
      cwd
    });

    spinner.stop();
  } catch (e) {
<<<<<<< HEAD
    spinner.fail('project dependences install failed')
    log.error(e)
    throw e;
  }
  spinner.succeed('project dependences install succeed!')
  log.success("create project sucess!");
=======
    spinner.fail("project dependences install failed");
    log.error("error: ", e);
    throw e;
  }
  spinner.succeed("project dependences install succeed!");
  log.success("[info]  ", "create project sucess!");
>>>>>>> ba9de3d9e37ee4305e7d36c7ceebd7f9b4969ffc
  process.exit(0);
}

module.exports = create;
