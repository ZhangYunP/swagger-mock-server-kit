const { EventEmitter } = require("events");

class FeedBack {
  constructor() {
    this.ev = new EventEmitter();
  }

  emit(...rest) {
    this.ev.emit("swagger-serve-change", ...rest);
  }

  on(cb) {
    this.ev.on("swagger-serve-change", cb);
  }
}

module.exports = new FeedBack();
