const _ = require("lodash");
const config = require("./config");
const base = require("./config.default");

module.exports = _.merge(base, config);
