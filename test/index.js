var ftl2html = require('../index.js');
var path = require('path');
var fs = require("fs");

var sourceRoot = path.resolve("test", "src");
var outputRoot = path.resolve("test", "out");
var ftlExt = ".ftl";
var tddExt = ".tdd";
var result = [];
var logFile = './test.log';

var ftlFileName = fs.readdirSync(sourceRoot).map(function (t) {
	if (path.extname(t) == ftlExt) {
		return path.basename(t, ftlExt);
	}
});

ftlFileName.forEach(function (t) {
	result.push({
		ftlFile: t + ftlExt,
		tddFiles: path.resolve("test", "tdd", t + tddExt) + ", " + path.resolve("test", "tdd", "common.tdd")
	});
});

result.map(function (t) {
	ftl2html(sourceRoot, outputRoot, t.ftlFile, t.tddFiles, logFile);
});
