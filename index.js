var execSync = require('child_process').execSync,
	fs = require('fs'),
	path = require('path'),
	isTest = (process.env.npm_lifecycle_script === 'mocha'),
	TIMEOUT = 30000;
	
function getParam(key) {
	var res = "";
	var flag = false;

	process.argv.forEach(function (val, index) {
		res = flag ? val : res;
		flag = (val == key) ? true : false;
	});

	return res;
}

/**
 * 调用fmpp转换函数
 * @param  {string} sourceRoot		ftl模板路径
 * @param  {string} outputRoot		输出html路径
 * @param  {string} ftlFile			编译的ftl文件名（相对sourceRoot）
 * @param  {string} tddFiles		mock数据文件
 * @param  {string} logPath			fmpp日志路径
 * @return {void}
 */
function ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logPath) {
	var javaPath = getParam("--java") || "java";
	var jarPath = path.resolve(__dirname, "lib", "jar", "fmpp.jar");
	var tddParam = "";
	logPath = logPath || "./fmpp.log";

	//tdd语法组装
	tddParam = tddFiles.split(",").map(function (t) {
		try {
			t = t.trim();
			fs.accessSync(t);
			return "tdd(" + t + ")";
		} catch (e) {
			console.log("No matched tdd File: " + t);
			return false;
		}
	}).filter(function (t) { return t; }).join(",");

	var command = `${javaPath} -jar ${jarPath} -S ${sourceRoot} -O ${outputRoot} ${ftlFile} --replace-extensions "ftl, html" -L ${logPath} -D "${tddParam}"`;

	try {
		execSync(command, {
			timeout: TIMEOUT
		});
	} catch (e) {
		console.log(command, e.stdout.toString());
	}
}

module.exports = ftl2html;