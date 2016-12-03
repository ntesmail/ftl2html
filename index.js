const execSync = require('child_process').execSync,
	exec = require('child_process').exec,
	fs = require('fs'),
	path = require('path'),
	isTest = (process.env.NODE_ENV === "test"),
	glob = require('glob'),
	FTLEXT = ".ftl",
	TDDEXT = ".tdd",
	HTMLEXT = ".html",
	TIMEOUT = 3000;

var defaultOption = {
	isDebug: false,	//todo test
	javaPath: getParam("--java") || "java",
	jarPath: path.resolve(__dirname, "lib", "jar", "fmpp.jar"),
	async: true,
	sourceRoot: "",
	outputRoot: "",
	dataRoot: "",
	ftlFile: "",	//regExp file expression
	tddFiles: [],		//common tdd file, relative to dataRoot or absoulte;
	logPath: "./fmpp.log",
	callback: null		//function (error, stdout, stderr) { }
};

function getParam(key) {
	var res = "";
	var flag = false;

	process.argv.forEach(function (val, index) {
		res = flag ? val : res;
		flag = (val == key) ? true : false;
	});

	return res;
}


function render(option) {
	var w = this;
	var isDebug = getParam("--debug") || w.config.debug;

	Object.assign(w.config, option);

	glob(path.resolve(w.config.sourceRoot, w.config.ftlFile), function (err, files) {
		files.forEach(function (t) {
			var fileName = path.basename(t, FTLEXT);

			w.config.tddParam = w.config.tddFiles.concat(path.resolve(__dirname, w.config.dataRoot, fileName + TDDEXT)).map(function (t) {
				try {
					t = t.trim();
					fs.accessSync(t);
					return "tdd(" + t + ")";
				} catch (e) {
					console.log("No matched tdd File: " + t);
					return false;
				}
			}).filter(function (t) { return t; }).join(",");

			var outputFile = path.resolve(w.config.outputRoot, fileName + HTMLEXT);

			try {		//todo elegance
				fs.accessSync(outputFile);
				fs.unlinkSync(outputFile);
			} catch (e) {

			}
			w.command = `${w.config.javaPath} -jar ${w.config.jarPath} -S ${w.config.sourceRoot} -O ${w.config.outputRoot} ${fileName + FTLEXT} -D "${w.config.tddParam}" --replace-extensions "ftl, html" -L "${w.config.logPath}" --append-log-file`;
			w.config.isDebug && console.log(w.command);

			if (w.config.async == true) {
				exec(w.command, {
					timeout: TIMEOUT
				}, function () {
					w.config.callback.apply(null, arguments);
				});
			} else {
				try {
					execSync(w.command, {
						timeout: TIMEOUT
					});
				} catch (e) {
					console.log(w.command, e.stdout.toString());
				}
			}
		})
	});
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
function ftl2html_compatible(sourceRoot, outputRoot, ftlFile, tddFiles, logPath) {
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

	var command = `${defaultOption.javaPath} -jar ${defaultOption.jarPath} -S ${sourceRoot} -O ${outputRoot} ${ftlFile} --replace-extensions "ftl, html" -L ${logPath} -D "${tddParam}" --append-log-file`;

	var fileName = path.basename(ftlFile, FTLEXT);
	var outputFile = path.resolve(outputRoot, fileName + HTMLEXT);

	try {		//todo elegance
		fs.accessSync(outputFile);
		fs.unlinkSync(outputFile);
	} catch (e) {

	}
	
	try {
		execSync(command, {
			timeout: TIMEOUT
		});
	} catch (e) {
		console.log(command, e.stdout.toString());
	}
}

function ftl2html(option) {
	if (typeof (option) === "string" && arguments.length >= 4) {
		return ftl2html_compatible.apply(null, arguments);
	}
	if (typeof (option) !== "object") {
		console.log("Usage: ftl2html(config) or ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logPath)");
		return false;
	}
	this.config = Object.assign({}, defaultOption, option);
}

ftl2html.prototype.render = function (option) {
	option.async = true;
	render.call(this, option);
}

ftl2html.prototype.renderSync = function (option) {
	option.async = false;
	render.call(this, option);
}

module.exports = ftl2html;