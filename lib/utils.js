var _ = require("lodash");
var path = require("path");
var Immutable = require("immutable");
var fs = require("fs-extra");

/**
 * @param {String} cwd
 * @param {String} outfile
 * @returns {String}
 */
function makeOutPath(cwd, outfile) {
    var outpath = path.join(cwd, outfile);
    var destdir = outpath.replace(path.basename(outpath), "");
    try {
        fs.ensureDirSync(destdir);
    } catch (e) {
        throw e;
    }
    return outpath;
}

/**
 * @param {Immutable.List} files
 * @param {String} cwd
 * @returns {String}
 */
function makeFilePaths(files, cwd) {
    return files.map(function (file) {
        return path.join(cwd, file);
    }).join(" ");
}

/**
 * @param {Immutable.Map} user
 * @param {Immutable.List} whitelist
 * @param {Immutable.Map} transforms
 * @returns {string|*}
 */
function createUserConfig(user, whitelist, transforms) {

    return user.reduce(function (curr, value, key) {
        if (whitelist.contains(key)) {
            if (transforms.has(key)) {
                return transforms.get(key)(value, user).merge(curr);
            } else {
                curr[key] = value;
            }
            return curr;
        }
        return curr;
    }, {});
}

/**
 * @param {Immutable.Map} args
 * @return {String}
 */
function commandify(args) {
    return args.map(function (value, key) {
        return "-" + key + " " + value;
    }).join(" ");
}

/**
 * @param {String} string - like stdout
 * @param {Number} code   - exit code
 */
function getReport(string, code) {

    return Immutable.Map((function () {

        var obj = {};
        if (code !== 0) {
            obj.status = "fail";
            obj.report = parseFail(string);
            obj.error  = getCmdError(string);
        } else {
            obj.status = "success";
        }
        return obj;
    })());
}

function getCmdError(stdout) {
    var fileinError = stdout.match("FAIL:INFILE:(.+?):");
    if (fileinError) {
        return "File not found: " + fileinError[1]
    }
    return false;
}

function parseFail(out) {
    var obj = {};
    var numpix = out.match("FAIL:PIXELS:(.+?):");
    var outfile = out.match("OUTFILE:(.+?):");

    if (!numpix) {
        return false; // It's some other error, not a thing from the file
    }

    if (numpix && numpix.length) {
        obj.numpix = numpix[1];
    }
    if (outfile && outfile.length) {
        obj.outfile = outfile[1];
    }
    return Immutable.Map(obj);
}

module.exports = {
    makeFilePaths: makeFilePaths,
    makeOutPath: makeOutPath,
    createUserConfig: createUserConfig,
    commandify: commandify,
    getReport: getReport
};