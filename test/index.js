var ftl2html = require('../index.js');
var path = require('path');
var fs = require("fs");

var sourceRoot = path.resolve(__dirname, "src");
var mockRoot = path.resolve(__dirname, "tdd");
var outputRoot = path.resolve(__dirname, "out");
var logFile = path.resolve(__dirname, "test.log");
var ftlExt = ".ftl";
var tddExt = ".tdd";
var htmlExt = ".html";
var param = [];
var expect = [
	'<i>test1</i><i>no</i><i>common</i>',
	'<script>var name = {"other":"wzf","me":"jfw10973"};var age = [26,["test"]];var worker = [{"age":25,"name":"A"},{"age":250,"name":"B"}];</script>'
];

var ftlFileName = fs.readdirSync(sourceRoot).map(function (t) {
	if (path.extname(t) == ftlExt) {
		return path.basename(t, ftlExt);
	}
});

ftlFileName.forEach(function (t) {
	param.push({
		ftlFile: t + ftlExt,
		htmlFile: path.resolve(outputRoot, t + htmlExt),
		tddFiles: path.resolve(mockRoot, t + tddExt) + ", " + path.resolve(mockRoot, "common" + tddExt)
	});
});

var result = param.every(function (t, idx) {
	ftl2html(sourceRoot, outputRoot, t.ftlFile, t.tddFiles, logFile);
	return fs.readFileSync(t.htmlFile, {encoding: "utf8"}) == expect[idx];
});

console.log(result);