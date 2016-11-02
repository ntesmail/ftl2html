var ftl2html = require('../index.js');
var path = require('path');
var fs = require("fs");
var assert = require('assert');
var config = require('./testDesc.json');

var fileRoot = path.resolve(__dirname, "_file");
var tmpRoot = path.resolve(__dirname, "_tmp");

var ftlExt = ".ftl";
var tddExt = ".tdd";
var htmlExt = ".html";
var logFile = "./fmpp.log";

fs.readdirSync(fileRoot).forEach(function (t) {
	if (path.extname(t) == ftlExt) {
		var fileName = path.basename(t, ftlExt);
		ftl2html(fileRoot, tmpRoot, fileName + ftlExt, path.resolve(fileRoot, fileName + tddExt) + ", " + path.resolve(fileRoot, "common" + tddExt), logFile);
		var expectContent = fs.readFileSync(path.resolve(fileRoot, fileName + htmlExt)).toString();
		var covertContent = fs.readFileSync(path.resolve(tmpRoot, fileName + htmlExt)).toString();

		describe(config[fileName].name, function () {
			it(config[fileName].describe, function () {
				assert.equal(expectContent, covertContent);
			});
		});
	}
});