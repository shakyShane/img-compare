const compare = require("./lib/compare");

module.exports = function (files, config, cb) {
    compare(files, config, cb);
};