var ftl2html = require('../index.js');
var path = require('path');
var fs = require("fs");
var expect = require('chai').expect;
var spawnSync = require('child_process').spawnSync;

var fileRoot = path.resolve(__dirname, "_file");
var tmpRoot = path.resolve(__dirname, "_tmp");

var ftlExt = ".ftl";
var tddExt = ".tdd";
var htmlExt = ".html";
var logFile = "./fmpp.log";
var javaVersion = 1.7;

describe("java runtime", function () {
	var res = spawnSync('java', ['-version']);
	var version = parseFloat(res.stderr.toString().match(/java version \"([\d,\.,\_]+)\"/)[1]);

	it('has java runtime', function () {
		expect(res.stderr.toString()).to.include('java version');
	});

	it('java version is ' + javaVersion + ' or later', function () {
		expect(version).to.be.at.least(javaVersion);
	});
});

describe("fmpp", function () {

	it('covert fmpp normally', function () {
		var fileName = "normal";
		ftl2html(fileRoot, tmpRoot, fileName + ftlExt, path.resolve(fileRoot, fileName + tddExt) + ", " + path.resolve(fileRoot, "common" + tddExt), logFile);
		var expectContent = fs.readFileSync(path.resolve(fileRoot, fileName + htmlExt)).toString();
		var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

		expect(expectContent).to.equal(covertContent);
	});

	it('covert bad template warning', function (done) {
		var fileName = "error";
		ftl2html(fileRoot, tmpRoot, fileName + ftlExt, path.resolve(fileRoot, fileName + tddExt) + ", " + path.resolve(fileRoot, "common" + tddExt));
		fs.access(path.resolve(tmpRoot, fileName + htmlExt), fs.constants.F_OK, function (err) {
			expect(err).to.not.equal(null);
			done();
		});
	});
});

describe("extend syntax", function () {
	var fileName = "parseObj";
	ftl2html(fileRoot, tmpRoot, fileName + ftlExt, path.resolve(fileRoot, fileName + tddExt) + ", " + path.resolve(fileRoot, "common" + tddExt), logFile);
	var expectContent = JSON.parse(fs.readFileSync(path.resolve(fileRoot, fileName + htmlExt)).toString());
	var covertContent = JSON.parse(fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString());

	it('parse Object correct', function () {
		expect(expectContent.object).to.deep.equal(covertContent.object);
	});

	it('parse Array correct', function () {
		expect(expectContent.array).to.deep.equal(covertContent.array);
	});

	it('parse ObjectArray correct', function () {
		expect(expectContent.objectArray).to.deep.equal(covertContent.objectArray);
	});
});

describe("default param", function () {
	var fileName = "normal";
	ftl2html(fileRoot, tmpRoot, fileName + ftlExt, path.resolve(fileRoot, fileName + tddExt) + ", " + path.resolve(fileRoot, "common" + tddExt));
	it('default log path', function (done) {
		fs.access(path.resolve("./fmpp.log"), fs.constants && fs.constants.F_OK || fs.F_OK, function (err) {
			expect(err).to.equal(null);
			done();
		});
	});
});