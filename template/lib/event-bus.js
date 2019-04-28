const { EventEmitter } = require("events");

class EventBus {
  constructor() {
    this.ev = new EventEmitter();
  }

  emit(...rest) {
    this.ev.emit("setupPlugin", ...rest);
  }

  on(cb) {
    this.ev.on("setupPlugin", cb);
  }
}

module.exports = new EventBus();
