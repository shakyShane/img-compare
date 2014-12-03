var Immutable   = require('immutable');
var utils       = require('./utils');

/**
 * Map of configuration options that are to
 * be transformed to satisfy lib/pdiff interface
 */
module.exports = Immutable.Map({
    /**
     * Change the color of the diff pixels
     * @param {String} string
     * @returns {Immutable.Map}
     */
    diffColor: function (string) {
        return Immutable.Map(utils.getSplitArgs('diff', string));
    },
    /**
     * @param {String} string
     * @returns {Immutable.Map}
     */
    background: function (string) {
        return Immutable.Map(utils.getSplitArgs('bg', string));
    }
});