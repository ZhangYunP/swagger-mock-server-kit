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
  docFilename
} = baseconfig;

let start

if (notFoundFile(docFilename)) {
  start = require('./start-without-doc')
} else {
  start = require('./start-with-doc')
}

const release = start(app, baseconfig)

process.on("unhandledRejection", err => {
  elog("error: ", err);
  release()
  process.exit(1);
});

process.on("uncaughtException", err => {
  elog("error: ", err);
  release()
  process.exit(1);
});
