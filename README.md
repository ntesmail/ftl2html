ftl2html
=====

A convertor for freemarker developer

Example:

var ftl2html = require('ftl2html');
var path = require('path');

var sourceRoot = path.join(__dirname, 'demo/src/main/webapp/WEB-INF');
var outputRoot = path.join(__dirname, 'demo/src/test/mock/output');
var ftlFile = 'tmpl/main.ftl';
var tddFiles = path.join(__dirname, 'demo/src/test/mock/tdd/oglobal.tdd') + ',' + path.join(__dirname, 'demo/src/test/mock/tdd/main.tdd')
// optional
var logFile = path.join(__dirname, 'fmpp.log');

ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logFile);

ftl 文件中支持以下用法
var user = ${JSONObject.fromObject(user)};
var fids = ${JSONArray.fromObject(user.lockStatus.fids)};

```