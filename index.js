/* esversion: 6 */
const execSync = require("child_process").execSync,
    exec = require("child_process").exec,
    fs = require("fs"),
    path = require("path"),
    isTest = (process.env.NODE_ENV === "test"),
    glob = require("glob"),
    FTLEXT = ".ftl",
    TDDEXT = ".tdd",
    HTMLEXT = ".html"

var defaultOption = {
    isDebug: getParam("--debug") || false,
    javaPath: getParam("--java") || "java",
    jarPath: path.resolve(__dirname, "lib", "jar", "fmpp.jar"),
    async: true,
    sourceRoot: "",
    outputRoot: "",
    dataRoot: "",
    configFile: "none",
    ftlFile: "",		//regExp file expression
    tddFiles: [],		//common tdd file, relative to dataRoot or absoulte
    logPath: "none",
    len: 0,
    callback: null		//function (error, stdout, stderr) { }
}

function getParam(key) {
    var res = ""
    var flag = false

    process.argv.forEach(function (val, index) {
        res = flag ? val : res
        flag = (val == key) ? true : false
    })

    return res
}

function execCMD(isAsync, command) {
    const TIMEOUT = 3000
    return new Promise((resolve, reject) => {
        if (isAsync) {
            exec(command, {
                timeout: TIMEOUT
            }, function (error, stdout, stderr) {
                if (error) {
                    reject(command, stdout.toString())
                } else {
                    resolve.apply(null, arguments)
                }
            })
        } else {
            try {
                execSync(command, {
                    timeout: TIMEOUT
                })
            } catch (e) {
                // throw new Error(command, e.stdout.toString())
                console.log(command, e.stdout.toString())
            }
        }
    })
}

function compileFTL(t, filePath) {
    var w = this
    var fileName = path.basename(t, FTLEXT)
    var outputFile = path.resolve(w.config.outputRoot, fileName + HTMLEXT)

    w.config.sourceRoot = path.join(w.config.sourceRoot, filePath)
    w.config.dataRoot = path.join(w.config.dataRoot, filePath)
    w.config.outputRoot = path.join(w.config.outputRoot, filePath)

    w.config.tddParam = [].concat(w.config.tddFiles, fileName + TDDEXT).map(function (t) {
        t = path.resolve(w.config.dataRoot, t)
        try {
            t = t.trim()
            fs.accessSync(t)
            return "tdd(" + t + ")"
        } catch (e) {
            console.log("No matched tdd File: " + t)
            return false
        }
    }).filter(function (t) { return t }).join(",")

    w.command = `${w.config.javaPath} -jar ${w.config.jarPath} -S ${w.config.sourceRoot} -O ${w.config.outputRoot} ${fileName + FTLEXT} -D "${w.config.tddParam}" --replace-extensions "ftl, html" -L "${w.config.logPath}" -C "${w.config.configFile}"`

    try {		//todo elegance
        fs.unlinkSync(outputFile)
    } catch (e) { }

    return execCMD.call(w, w.config.async, w.command).then(() => {
        Array.prototype.push.call(arguments, fileName)
        w.config.callback && w.config.callback.apply(null, arguments)
    }, (command, stdout) => {
        w.config.isDebug && console.log(command, stdout)
    }).catch((command, stdout) => {
        w.config.isDebug && console.log(command, stdout)
    })
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
    var tddParam = ""
    logPath = logPath || "none"
    var fileName = path.basename(ftlFile, FTLEXT)
    var outputFile = path.resolve(outputRoot, fileName + HTMLEXT)

    //tdd语法组装
    tddParam = tddFiles.split(",").map(function (t) {
        try {
            t = t.trim()
            fs.accessSync(t)
            return "tdd(" + t + ")"
        } catch (e) {
            console.log("No matched tdd File: " + t)
            return false
        }
    }).filter(function (t) { return t }).join(",")

    try {		//todo elegance
        fs.unlinkSync(outputFile)
    } catch (e) { }

    var command = `${defaultOption.javaPath} -jar ${defaultOption.jarPath} -S ${sourceRoot} -O ${outputRoot} ${ftlFile} --replace-extensions "ftl, html" -L ${logPath} -D "${tddParam}"`
    execCMD(false, command)
}

function ftl2html(option) {
    if (typeof (option) === "string" && arguments.length >= 4) {
        return ftl2html_compatible.apply(null, arguments)
    }
    if (typeof (option) !== "object") {
        console.log("Usage: ftl2html(config) or ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logPath)")
        return false
    }
    this.initConfig = Object.assign({}, defaultOption, option)
}

ftl2html.prototype.render = function (option) {
    var w = this
    w.config = Object.assign({}, w.initConfig, option)

    var fileList = glob.sync(path.join(w.config.sourceRoot, w.config.ftlFile))
    // var filePath = path.dirname(w.config.ftlFile)

    w.config.len = fileList.length

    var seq = fileList.map(function (t) {
        compileFTL.call(w, t, path.dirname(t.split(w.config.sourceRoot)[1]))
    })

    Promise.all(seq).then(() => {
        this.config.done && this.config.done.apply(null, arguments)
    })
}

module.exports = ftl2html