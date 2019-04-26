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
  .option("-y, --yarn", "use yarn")
  .action(create);

program
  .command("start [cwd]")
  .description("start mock server")
  .option("-o, --open [url]", "open browser in url")
  .action(start);

program
  .parse(process.argv)
