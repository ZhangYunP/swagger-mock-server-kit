const fs = require("fs-extra");
const path = require("path");
const { root } = require("../config");

function create(projectName = "swagger-mock-server", options) {
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
  console.log("create project sucess");
}

module.exports = create;
