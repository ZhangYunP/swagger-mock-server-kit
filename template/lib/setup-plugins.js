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
    plugins.forEach(plugin => {
      let pluginModule
      try {
        pluginModule = require(plugin);
        pluginModule(body);
      } catch (e) {
        throw e;
      }
      success("[info]  ", `plugin ${pluginModule.name} install success`);
    });
  });
  return remove
}

module.exports = perparePlugin
