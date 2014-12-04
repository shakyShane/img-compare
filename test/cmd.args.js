var comp   = require("../lib/compare.js");
var utils  = require("../lib/utils.js");
var assert = require("chai").assert;
var trans  = require("../lib/arg-transforms");

var Immutable = require('immutable');

var defaults = Immutable.Map({
    gamma: 1,
    output: "diff.png"
});

describe("merging cmd line args", function(){
    it("should merge", function() {

        var merged = defaults.merge(
            utils.createUserConfig(Immutable.Map({
                gamma: 2,
                threshold: 0
            }), comp.whitelist, trans)
        );

        var actual = utils.commandify(merged);
        var expected = "-gamma 2 -output diff.png -threshold 0";

        assert.equal(actual, expected);
    });
    it("should merge (2)", function(){
        var merged = defaults.merge(
            utils.createUserConfig(Immutable.Map({
                gamma: 2,
                threshold: 0,
                output: "test/fixtrues/diff2.png"
            }), comp.whitelist, trans)
        );
        var actual   = utils.commandify(merged);
        var expected = "-gamma 2 -output test/fixtrues/diff2.png -threshold 0";
        assert.equal(actual, expected);
    });
    it("should merge colors (2)", function(){
        var merged = defaults.merge(
            utils.createUserConfig(Immutable.Map({
                gamma: 2,
                threshold: 0,
                output: "test/fixtrues/diff2.png",
                diffColor: '0,255,100'
            }), comp.whitelist, trans)
        );
        var actual   = utils.commandify(merged);
        var expected = "-gamma 2 -output test/fixtrues/diff2.png -threshold 0 -diff-red 0 -diff-green 255 -diff-blue 100";
        assert.equal(actual, expected);
    });
    it("should merge BG colors", function() {
        var merged = defaults.merge(
            utils.createUserConfig(Immutable.Map({
                gamma: 2,
                threshold: 0,
                output: "test/fixtrues/diff2.png",
                background: '0,255,100'
            }), comp.whitelist, trans)
        );
        var actual   = utils.commandify(merged);
        var expected = "-gamma 2 -output test/fixtrues/diff2.png -threshold 0 -bg-red 0 -bg-green 255 -bg-blue 100";
        assert.equal(actual, expected);
    });
});

describe("transforming args", function () {
    it("should convert args", function () {
        var input  = "255, 0, 0";
        var actual = trans.get("diffColor")(input);
        assert.equal(actual['diff-blue'], 0);
    });
    it("should convert diffColor args", function () {
        var input  = "0, 0, 255";
        var actual = trans.get("diffColor")(input);
        assert.equal(actual['diff-blue'], 255);
        assert.equal(actual['diff-red'],   0);
        assert.equal(actual['diff-green'], 0);
    });
    it("should convert background args", function () {
        var input  = "0, 0, 255";
        var actual = trans.get("background")(input);
        assert.equal(actual['bg-blue'], 255);
        assert.equal(actual['bg-red'],   0);
        assert.equal(actual['bg-green'], 0);
    });
});