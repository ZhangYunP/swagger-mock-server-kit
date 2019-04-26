const fs = require("fs-extra");
const path = require("path");
const spawn = require("cross-spawn");
const ora = requir('ora')
const {
  root
} = require("../config");

let spawnCmd

function create(projectName = "swagger-mock-server", options) {
  const distDir = path.join(process.cwd(), projectName);
  console.log('distDir is: ', distDir)
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);
  const sourceDir = path.join(root, "template");
  if (!fs.existsSync(sourceDir)) {
    throw new Error("source dir must be exists");
  }
  try {
    fs.copySync(sourceDir, distDir);
  } catch (e) {
    throw e;
  }
  installDeps(options, distDir);
}

function installDeps(options, cwd) {
  if (options.yarn) {
    spawnCmd = "yarn";
  } else {
    spawnCmd = "npm";
  }
  try {
    const spinner = ora('now install dependences , please wait...').start()

    const child = spawn.sync(spawnCmd, ["install"], {
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
