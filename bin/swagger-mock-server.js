#!/usr/bin/env node

const program = require("commander");
const {
  version
} = require("../package.json");
const {
  create,
  start
} = require("../scripts");

program.version(version);

program
  .command("create [projectName]")
  .description("create a mock server project")
  .option('-i, --install [install]', 'auto install dependences')
  .option('-y, --yarn', 'use yarn')
  .option('-r, --registry [registry]', 'set npm registry')
  .action(create);

program
  .command("start [cwd]")
  .description("start mock server")
  .option("-o, --open [url]", "open browser in url")
  .action(start);

program
  .parse(process.argv)
