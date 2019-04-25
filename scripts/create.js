const fs = require("fs-extra");
const path = require("path");
const { root } = require("../config");
const spawn = require("cross-spawn");

function create(projectName = "swagger-mock-server", options) {
  let command;
  const distDir = path.join(process.cwd(), projectName);
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
    command = "yarn";
  } else {
    command = "npm";
  }
  try {
    const child = spawn.sync(command, ["install"], {
      cwd
    });
  } catch (e) {
    throw e;
  }
  console.log("create project sucess");
  process.exit(0);
}

module.exports = create;
