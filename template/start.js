const express = require("express");
const config = require("./config");
const {
  formatConfig,
  error: elog,
  notFoundFile
} = require("./lib/utils");

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
