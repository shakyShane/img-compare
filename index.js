var compare = require("./lib/compare");

var defaults = {
    cwd: process.cwd(),
    out: "diff2.png"
}

module.exports = function (files, config, cb) {

    config.cwd = config.cwd || defaults.cwd;
    config.out = config.out || defaults.out;

    compare(files, config, cb);
};