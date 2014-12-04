const compare = require("./lib/compare");

/**
 * @param {Array} files
 * @param {Object} config
 * @param cb
 */
module.exports = function (files, config, cb) {
    compare(files, config, cb);
};