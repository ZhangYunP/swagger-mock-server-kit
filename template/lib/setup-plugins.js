const { plugins } = require("../config");

const bus = require("../lib/event-bus");

const { success } = require("../lib/utils");

bus.on(body => {
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
