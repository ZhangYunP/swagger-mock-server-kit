const fs = require("fs-extra");
const path = require("path");
const ora = require("ora");
const rimraf = require("rimraf");
const util = require("util");
const asyncSpawn = require("../lib/async-spawn");
const log = require("../lib/log");

const { root, npmRegistry } = require("../config");

const clean = util.promisify(rimraf);

let spawnCmd;
const cmdArg = ['install'];

function create(projectName = "swagger-mock-server", options) {
  (async () => {
    try {
      log.slog(
        " info ",
        "will create project '" +
        projectName + "'"
      );
  
      const distDir = path.join(process.cwd(), projectName);
      if (fs.existsSync(distDir)) {
        await clean(distDir);
        log.slog(" info ", "delete distDir success");
      }
      fs.mkdirSync(distDir);
  
      const sourceDir = path.join(root, "template");
  
      // log.slog(
      //   " info ",
      //   "template path is: " + sourceDir + ", and will copy to " + distDir
      // );
  
      if (!fs.existsSync(sourceDir)) {
        throw new Error("source dir must be existed");
      }
  
      await fs.copy(sourceDir, distDir);
  
      // log.slog(" info ", "copy template to distDir success!");
      const shouldInstall = options.install !== 'false'
      shouldInstall && await installDeps(options, distDir);

      log.slog(" Done ", "create project '" + projectName + "' succeed!");

      console.log('\ntips:')
      console.log('          cd ' + projectName)
      !shouldInstall && console.log('          npm install')
      console.log('          npm start')

      process.exit(0);
    } catch (e) {
      log.elog(' error ', e.message)
      process.exit(1)
    }
  })();
}

async function installDeps(options, cwd = process.cwd()) {
  if (!fs.existsSync(path.join(cwd, 'package.json'))) {
    throw new Error('template occured, do not exist package.json, seem like a bug')
  }

  if (fs.existsSync(path.join(cwd, 'node_modules'))) {
   log.wlog(' wraning ', 'node_modules has existed, delete it can avoid some conflict') 
   await clean(path.join(cwd, 'node_modules'))
  }

  if (options.yarn) {
    spawnCmd = "yarn";
  } else {
    spawnCmd = "npm";
  }

  if (options.registry) {
      cmdArg.push('--registry ' + options.registry)
  } else {
    cmdArg.push('--registry ' + npmRegistry)
  }

  log.slog(' download ', 'now install dependences , please wait...');

  const spinner = ora("").start();
  spinner.spinner = {
		"interval": 50,
		"frames": [
			"◐",
			"◓",
			"◑",
			"◒"
		]
  }
  
  await asyncSpawn(
    {
      name: 'install-dependences',
      ignoreErrorMessage: true,
      spinner,
      defaultOutString: 'now download dependences use npm, please wait ...'
    },
    spawnCmd,
    cmdArg,
    {
      cwd,
    }
  );

  spinner.stop();
  log.slog(" success ", "dependences install succeed!")

}

module.exports = create;
