var compare = require("./lib/compare");

var defaults = {
    cwd: process.cwd(),
    output: "diff.png"
}

module.exports = function (files, config, cb) {

    config.cwd    = config.cwd    || defaults.cwd;
    config.output = config.output || defaults.output;

    compare(files, config, cb);
};