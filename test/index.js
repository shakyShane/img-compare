const comp   = require("../lib/compare.js");
const utils  = require("../lib/utils.js");
const assert = require("chai").assert;
const trans  = require("../lib/arg-transforms");

const Immutable = require('immutable');
const userConfig = {};

const defaults = Immutable.Map({
    gamma: 1,
    output: "diff.png"
});

//describe("Calling api", function() {
    //it.only("runs", function () {
    //    comp(["test1.png", "test2.png"], userConfig, function (err, out) {
    //        //console.log(err);
    //        //console.log(out);
    //    });
    //});
//});