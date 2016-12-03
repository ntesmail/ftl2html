var ftl2html = require('../index.js');
var path = require('path');
var fs = require("fs");
var expect = require('chai').expect;
var spawnSync = require('child_process').spawnSync;

var srcRoot = path.resolve(__dirname, "_src");
var dataRoot = path.resolve(__dirname, "_tdd");
var targetRoot = path.resolve(__dirname, "_target");
var tmpRoot = path.resolve(__dirname, "_tmp");

var ftlExt = ".ftl";
var tddExt = ".tdd";
var htmlExt = ".html";
var logFile = "./fmpp.log";
var javaVersion = 1.7;

describe("java runtime", function() {
    var res = spawnSync('java', ['-version']);
    var version = parseFloat(res.stderr.toString().match(/java version \"([\d,\.,\_]+)\"/)[1]);

    it('has java runtime', function() {
        expect(res.stderr.toString()).to.include('java version');
    });

    it('java version is ' + javaVersion + ' or later', function() {
        expect(version).to.be.at.least(javaVersion);
    });
});

describe("ftl2html usage", function() {
    it('use ftl2html unexpect', function() {
        var res = ftl2html();
        expect(res).to.equal(false);
    });
});

describe("recommand", function() {
    var f = new ftl2html({
        sourceRoot: srcRoot,
        dataRoot: dataRoot,
        outputRoot: tmpRoot,
        tddFiles: [path.resolve(dataRoot, "common" + tddExt)]
    });

    describe("fmpp", function() {
        it('covert fmpp normally config async', function(done) {
            var fileName = "normal";

            f.render({
                ftlFile: fileName + ftlExt,
                callback: function(error, stdout, stderr) {
                    var expectContent = fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString();
                    var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

                    expect(expectContent).to.equal(covertContent);
                    done();
                }
            });
        });

        it('covert fmpp normally config sync', function() {
            var fileName = "normal";

            f.renderSync({
                ftlFile: fileName + ftlExt
            });

            var expectContent = fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString();
            var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

            expect(expectContent).to.equal(covertContent);
        });

        it('covert bad template warning', function(done) {
            var fileName = "error";

            f.render({
                ftlFile: fileName + ftlExt,
                callback: function(error, stdout, stderr) {
                    fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
                        expect(err).to.not.equal(null);
                        done();
                    });
                }
            });
        });

        it('covert bad template warning sync', function(done) {
            var fileName = "error";

            f.renderSync({
                ftlFile: fileName + ftlExt
            });

			fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
				expect(err).to.not.equal(null);
				done();
			});
        });

        it('covert bad template warning', function(done) {
            var fileName = "error";

            f.render({
                ftlFile: fileName + ftlExt,
                callback: function(error, stdout, stderr) {
                    fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
                        expect(err).to.not.equal(null);
                        done();
                    });
                }
            });
        });

        it('covert template without match tdd', function(done) {
            var fileName = "nomatchtdd";

            f.render({
                ftlFile: fileName + ftlExt,
                callback: function(error, stdout, stderr) {
                    var expectContent = fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString();
                    var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

                    expect(expectContent).to.equal(covertContent);
                    done();
                }
            });
        });
    });
});

describe("compatible", function() {
    describe("fmpp", function() {
        it('covert fmpp normally', function() {
            var fileName = "normal";
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt), logFile);
            var expectContent = fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString();
            var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

            expect(expectContent).to.equal(covertContent);
        });

        it('covert bad template warning', function(done) {
            var fileName = "error";
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt));
            fs.access(path.resolve(tmpRoot, fileName + htmlExt), function(err) {
                expect(err).to.not.equal(null);
                done();
            });
        });

        it('covert template without match tdd', function() {
            var fileName = "nomatchtdd";
            ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt));
            var expectContent = fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString();
            var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

            expect(expectContent).to.equal(covertContent);
        });
    });

    describe("extend syntax", function() {
        var fileName = "parseObj";
        ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt), logFile);
        var expectContent = JSON.parse(fs.readFileSync(path.resolve(targetRoot, fileName + htmlExt)).toString());
        var covertContent = JSON.parse(fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString());

        it('parse Object correct', function() {
            expect(expectContent.object).to.deep.equal(covertContent.object);
        });

        it('parse Array correct', function() {
            expect(expectContent.array).to.deep.equal(covertContent.array);
        });

        it('parse ObjectArray correct', function() {
            expect(expectContent.objectArray).to.deep.equal(covertContent.objectArray);
        });
    });

    describe("default param", function() {
        var fileName = "normal";
        ftl2html(srcRoot, tmpRoot, fileName + ftlExt, path.resolve(dataRoot, fileName + tddExt) + ", " + path.resolve(dataRoot, "common" + tddExt));
        it('default log path', function(done) {
            fs.access(path.resolve("./fmpp.log"), function(err) {
                expect(err).to.equal(null);
                done();
            });
        });
    });
});