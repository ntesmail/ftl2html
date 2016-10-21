var execSync = require('child_process').execSync,
	path = require('path'),
	TIMEOUT = 30000;


/**
 * 转换函数，除了ftlFile，都使用绝对路径
 * @param  {string} sourceRoot     ftl模板路径
 * @param  {string} outputRoot     输出html路径
 * @param  {string} ftlFile        编译的ftl文件名（相对sourceRoot）
 * @param  {string} tddFiles       mock数据文件
 * @return {void}                [ ]
 */

function ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logPath) {
	var jarPath = path.join(__dirname, "jar/fmpp.jar");
	var tddParam = "";
	logPath = logPath || "./fmpp.log";

	if (tddFiles) {
		//tdd语法组装
		tddParam = tddFiles.split(",").map(function(t) {
			return "tdd(" + t + ")";
		}).join(",");
	}

	var command = `java -jar ${jarPath} -S ${sourceRoot} -O ${outputRoot} ${ftlFile} --replace-extensions "ftl, html" -L ${logPath} -D "${tddParam}"`;

	var res = execSync(command, {
		timeout: TIMEOUT
	});

	console.log(res.toString("utf8"));
}

module.exports = ftl2html;
