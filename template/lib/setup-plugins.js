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
      try {
        const pluginModule = require(plugin);
        pluginModule(body);
      } catch (e) {
        throw e;
      }
      success("[info]  ", `plugin ${p.name} install success`);
    });
  });
  return remove
}

module.exports = perparePlugin
