const comp   = require("../lib/compare.js");
const utils  = require("../lib/utils.js");
const multi  = require("multiline");
const assert = require("chai").assert;
const Immutable = require('immutable');

const example = {
    status: 'fail',
    report: {
        numpix: '6069',
        outfile: '/Users/shakyshane/code/img-compare/diff.png'
    },
    error: false
};

describe("parsing stdout", function() {
    it("can take stdout and produce a report", function () {
        var out = multi(function () {/*
FAIL:PIXELS:6069:
OUTFILE:/Users/shakyshane/code/img-compare/diff.png:
*/});
        var actual = utils.getReport(out, 1); // fail code from pdiff
        assert.equal(actual.get('status'), 'fail');
        assert.equal(actual.get('error'),   false);
        assert.equal(actual.get('report').get('outfile'), example.report.outfile);
        assert.equal(actual.get('report').get('numpix'), example.report.numpix);
    });
    it("can run a failure", function (done) {
        comp(["test/fixtures/01.png", "test/fixtures/02.png"], {}, function (err, out) {
            assert.equal(out.get('report').get('numpix'), "6069");
            done();
        });
    });
    it("can run a success", function (done) {
        comp(["test/fixtures/01.png", "test/fixtures/03.png"], {}, function (err, out) {
            assert.equal(out.get('status'), 'success');
            done();
        });
    });
    it("returns error object when file not found", function (done) {
        comp(["test/fixtures/01.pngs", "test/fixtures/02.png"], {}, function (err, out) {
            assert.equal(err.name, "Error");
            done();
        });
    });
});