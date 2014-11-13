var comp = require("../lib/compare.js");
var assert = require("chai").assert;

describe("merging cmd line args", function(){
    it("should merge", function(){
        var out = comp.mergeCmdOpts({gamma: 1, output: "diff.png"}, {gamma: 2, threshold: 0});
        assert.equal(out, "-gamma 2 -output diff.png -threshold 0");
    });
    it("should merge (2)", function(){
        var out = comp.mergeCmdOpts({gamma: 1, output: "diff.png"}, {gamma: 2, threshold: 0, output: "test/fixtrues/diff2.png"});
        assert.equal(out, "-gamma 2 -output test/fixtrues/diff2.png -threshold 0");
    });
});