var path        = require("path");
var exec        = require("child_process").exec;
var fs          = require("fs-extra");
var args        = path.join(__dirname, "pdiff");
var opts        = "-gamma 2.4";

module.exports = function (files, config, cb) {
    var cmd = [args, makePaths(files, config.cwd), opts, "-output " + makeOutPath(config.cwd, config.out)].join(" ");
    runOne({
        command: cmd,
        cb: cb || function () { /*noop*/ }
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

/**
 * @param item
 * @param cb
 */
function runOne (item) {
    var out = "";
    exec(item.command, {cwd: item.cwd}, function (err, stdout) {
        out += stdout;
    }).on("close", function (code) {
        var result = getResult(out, code);
        if (result.error) {
            item.cb(new Error(result.error), result);
        } else {
            item.cb(null, result);
        }
    });
}

function getResult(out, code) {
    var obj = {};
    if (code !== 0) {
        obj.status = "fail";
        obj.report = parseFail(out);
        obj.error  = getCmdError(out);
    } else {
        obj.status = "success";
    }
    return obj;
}

function getCmdError (stdout) {
    var fileinError = stdout.match("FAIL:INFILE:(.+?):");

    if (fileinError) {
        return "File not found: " + fileinError[1]
    }
}

function parseFail (out) {
    var obj = {};
    var numpix  = out.match("FAIL:PIXELS:(.+?):");
    var outfile = out.match("OUTFILE:(.+?):");
    if (numpix && numpix.length) {
        obj.numpix = numpix[1];
    }
    if (outfile && outfile.length) {
        obj.outfile = outfile[1];
    }
    return obj;
}

function getStats (item, out) {

    //console.log(out);
    var stats = {};

    if (out.length > 0) { // there's stdout
        var split = out.split("\n");
        var matches;
        if (matches = split[1].match(/^(\d)+? /)) {
            stats.pixeldiff = matches[0];
        } else {
            stats.pixeldiff = null;
        }
    }

    return stats;
}