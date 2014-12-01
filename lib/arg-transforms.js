
module.exports = {
    diffColor: function (input) {
        return input
            .split(',')
            .map(function (string) {
                return string.trim();
            })
            .reduce(function (joined, item, i) {
                joined['diff-' + (function (i) {
                    switch(i) {
                        case 0: return 'red'; break;
                        case 1: return 'green'; break;
                        case 2: return 'blue'; break;
                    }
                })(i)] = item;
                return joined;
            }, {});
    }
};