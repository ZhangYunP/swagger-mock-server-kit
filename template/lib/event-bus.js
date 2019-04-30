const {
  EventEmitter
} = require("events");

class EventBus {
  constructor(name) {
    this.name = name
    this.ev = new EventEmitter();
  }

  emit(...rest) {
    this.ev.emit(this.name, ...rest);
  }

  on(cb) {
    this.ev.on(this.name, cb);
    return () => {
      this.remove(cb)
    }
  }

  remove(cb) {
    this.ev.removeListener(this.name, cb)
  }

  removeAll() {
    this.ev.removeAllListeners(this.name)
  }
}

module.exports = new EventBus('setupPlugin');
