var execSync = require('child_process').execSync,
	path = require('path'),
	TIMEOUT = 30000;

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
	var jarPath = path.resolve(__dirname, "lib", "jar", "fmpp.jar");
	var tddParam = "";
	logPath = logPath || "./fmpp.log";
	//tdd语法组装
	if (tddFiles) {
		tddParam = tddFiles.split(",").map(function (t) {
			return "tdd(" + t + ")";
		}).join(",");
	}

	var command = `java -jar ${jarPath} -S ${sourceRoot} -O ${outputRoot} ${ftlFile} --replace-extensions "ftl, html" -L ${logPath} -D "${tddParam}"`;

	try {
		execSync(command, {
			timeout: TIMEOUT
		});
	} catch(e) {
		console.log(e.stdout.toString());
	}
}

module.exports = ftl2html;