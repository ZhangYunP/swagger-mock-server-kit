const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const ora = require('ora')
const rimraf = require('rimraf')
const util = require("util")

const {
  root
} = require("../config");

const clean = util.promisify(rimraf)
const execute = util.promisify(spawn)

let spawnCmd

function create(projectName = "swagger-mock-server", options) {
  (async () => {
    console.log("projectName: ", projectName)
    console.log("useYarn: ", options.yarn)

    const distDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(distDir)) {
      await clean(distDir)
      console.log('delete distDir succeed')
    }
    fs.mkdirSync(distDir);

    const sourceDir = path.join(root, "template");

    console.log('template path is: ' + sourceDir, ", and will copy to " + distDir)

    if (!fs.existsSync(sourceDir)) {
      throw new Error("source dir must be exists");
    }
    try {
      await fs.copy(sourceDir, distDir);
    } catch (e) {
      throw e;
    }

    console.log('copy succeed!')
    await installDeps(options, distDir);
  })()
}

async function installDeps(options, cwd = process.cwd()) {
  if (options.yarn) {
    spawnCmd = "yarn";
  } else {
    spawnCmd = "npm";
  }
  try {
    var spinner = ora('now install dependences , please wait...').start()

    await execute(spawnCmd, ["install"], {
      cwd
    });

    spinner.stop()
  } catch (e) {
    spinner.fail('project dependences install failed')
    throw e;
  }
  spinner.succeed('project dependences install succeed!')
  console.log("create project sucess");
  process.exit(0);
}

module.exports = create;
