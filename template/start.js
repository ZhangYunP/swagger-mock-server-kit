const express = require("express");
const path = require('path')
const fs = require('fs')
let config = require("./config");
const {
  formatConfig,
  error: elog,
  notFoundFile
} = require("./lib/utils");

const customConfigPath = path.resolve(process.cwd(), '..', 'config/app.config.js')
const customConfig = fs.existsSync(customConfigPath) ? require(customConfigPath).mockServer: {}

config = Object.assign(config, customConfig)

const app = express()

const baseconfig = formatConfig(config);
const {
  docFilename,
  online
} = baseconfig;

let start

if (notFoundFile(docFilename) && !online) {
  start = require('./start-without-doc')
} else {
  start = require('./start-with-doc')
}

(async () => {
  await start(app, baseconfig)
})()

process.on("unhandledRejection", err => {
  elog(" error ", err);
  process.exit(1);
});

process.on("uncaughtException", err => {
  elog(" error ", err);
  process.exit(1);
});
