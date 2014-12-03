// core
const exec        = require("child_process").exec;
const path        = require('path');

// lib
const utils       = require("./utils");
const transforms  = require("./arg-transforms");

// 3rd party
const Immutable   = require('immutable');

/**
 * Path to p-diff executable
 */
const programPath = path.join(__dirname, "pdiff");

/**
 * List of allowed args in program lib/pdiff
 */
const whitelist = Immutable.List([
    "gamma",
    "threshold",
    "output",
    "color",
    "diffColor",
    "background"
]);

/**
 * Default configuration
 */
const defaults = Immutable.Map({
    gamma: "2.4",
    threshold: "0",
    cwd: process.cwd()
});

/**
 * @param {Array} files   - two strings containing file paths
 * @param {Object} config - key:value configuration
 * @param {Function} cb   - callback function for receiving results.
 */
module.exports = function (files, config, cb) {

    config = Immutable.Map(config || {});
    files  = Immutable.List(files);

    //console.log(getData(
    //    defaults,
    //    config
    //));

    const data = addOutputPath(
        getData(
            defaults,
            config
        )
    );

    runOne(Immutable.Map({
        config: data,
        command: [
            programPath,
            // Use cwd to create two absolute file paths
            utils.makeFilePaths(
                files,
                data.get('cwd')
            ),
            // Filter to whitelist args & create a command string
            utils.commandify(
                data.filter(function (item, key) {
                    return whitelist.contains(key)
                })
            )
        ].join(" "),
        cb: cb || function () { /*noop*/ }
    }));
};

/**
 * @param {Immutable.Map} defaults
 * @param {Immutable.Map} config
 * @returns {Immutable.Map}
 */
function getData(defaults, config) {

    return defaults.merge(
        utils.createUserConfig(
            config,
            whitelist,
            transforms
        )
    );
}

function addOutputPath (data) {
    if (data.has('output')) {
        return data.set('output',
            utils.makeOutPath(
                data.get('cwd'),
                data.get('output')
            )
        );
    }
    return data;
}

module.exports.whitelist = whitelist;

/**
 * @param {Immutable.Map} item
 */
function runOne(item) {
    var out = "";
    var cmdError;
    const cb = item.get('cb');

    exec(item.get('command'), {
        cwd: item.get('config').get('cwd')
    }, function (err, stdout) {
        if (err) {
            cmdError = err;
        }
        out += stdout;
    }).on("close", function (code) {
        var result = utils.getReport(out, code);
        if (code !== 0) {
            if (result.has('error')) { // Check if it's an error we can display
                cb(new Error(result.get('error')), result);
            } else {
                if (cmdError && !result.get('report')) {
                    cb(cmdError, result);
                } else {
                    cb(null, result);
                }
            }
        } else {
            cb(null, result);
        }
    });
}