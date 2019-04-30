const {
  plugins
} = require("../config");
const bus = require("../lib/event-bus");
const {
  success
} = require("../lib/utils");

const perparePlugin = () => {
  const remove = bus.on(body => {
    success("[info]  ", `start execute plugin`);
    const next = () => {
      if (!plugins.length) {
        success("[info]  ", `all plugins install success`)
        return
      }
      const plugin = plugins.shift()
      try {
        pluginModule = require(plugin);
        const done = pluginModule(body);
        if (done === true) {
          success("[info]  ", `plugin ${pluginModule.name} install success`)
          next()
        }
      } catch (e) {
        throw e;
      }
    }
    next()
  });
  return remove
}

module.exports = perparePlugin
