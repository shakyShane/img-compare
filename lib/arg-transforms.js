var Immutable   = require('immutable');
var utils       = require('./utils');

module.exports = Immutable.Map({
    diffColor: function (string) {
        return Immutable.Map(getSplitArg('diff', string));
    },
    background: function (string) {
        return Immutable.Map(getSplitArg('bg', string));
    }
});

function getSplitArg(prefix, string) {
    return string
        .split(',')
        .map(function (string) {
            return string.trim();
        })
        .reduce(function (joined, item, i) {
            joined[prefix + '-' + (function (i) {
                switch(i) {
                    case 0: return 'red'; break;
                    case 1: return 'green'; break;
                    case 2: return 'blue'; break;
                }
            })(i)] = item;
            return joined;
        }, {});
}