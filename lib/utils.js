var _           = require("lodash");
var path        = require("path");
var fs          = require("fs-extra");

function assign(obj, items) {
    _.each(items, function (value, key) {
        obj[key] = value;
    });
}

function makeOutPath (cwd, outfile) {
    var outpath = path.join(cwd, outfile);
    var destdir = outpath.replace(path.basename(outpath), "");
    try {
        fs.ensureDirSync(destdir);
    } catch (e) {
        throw e;
    }
    return outpath;
}

function makePaths (files, dir) {
    return files.map(function (file) {
        return [dir, file].join("/");
    }).join(" ");
}

function mergeCmdOpts (defaults, user, whitelist, transforms) {

    var usercmds  = _.reduce(user, function (curr, value, key) {
        if (_.contains(whitelist, key)) {
            if (transforms[key]) {
                assign(curr, transforms[key](value));
            } else {
                curr[key] = value;
            }
            return curr;
        }
        return curr;
    }, {});

    return _.map(_.merge(defaults, usercmds), function (value, key) {
        return "-" + key + " " + value;
    }).join(" ");
}


module.exports = {
    assign: assign,
    makePaths: makePaths,
    makeOutPath: makeOutPath,
    mergeCmdOpts: mergeCmdOpts
};