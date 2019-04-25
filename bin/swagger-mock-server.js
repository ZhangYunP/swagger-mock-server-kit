const program = require("commander");
const { version } = require("package.json");
const { create, start } = require("../scripts/index");

program.version(version);

program
  .command("create [projectName]", "create a mock server project")
  .action(create);

program.command("start", "start mock server").action(start);
