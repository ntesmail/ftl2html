# ftl2html

ftl2html is a clean, **just one dependency** Node.js module invoke fmpp convert freemarker and data to html.

**You need to Install Java Runtime Environment(JRE) 1.7+ first.**

[![Build Status](https://img.shields.io/travis/ntesmail/ftl2html/master.svg?style=flat)](https://travis-ci.org/ntesmail/ftl2html)
[![Coverage Status](https://img.shields.io/coveralls/ntesmail/ftl2html/master.svg?style=flat)](https://coveralls.io/r/ntesmail/ftl2html?branch=master)
[![Dependency Status](https://img.shields.io/david/ntesmail/ftl2html.svg?style=flat)](https://david-dm.org/ntesmail/ftl2html)
[![devDependencies Status](https://img.shields.io/david/dev/ntesmail/ftl2html.svg?style=flat)](https://david-dm.org/ntesmail/ftl2html?type=dev)
[![NPM version](https://img.shields.io/npm/v/ftl2html.svg?style=flat)](https://www.npmjs.com/package/ftl2html)

## Installation

via npm:

```bash
$ npm install ftl2html
```

## example

ftlPath: 
```
/test/_src/normal.ftl
/test/_src/parseObj.ftl
```

tddPath: 
```
/test/_tdd/normal.tdd
/test/_tdd/parseObj.tdd
```
targetPath:
```
/test/_target/
```

just run:
```js
var f = new ftl2html({
    sourceRoot: "_src",
    dataRoot: "_tdd",
    outputRoot: "_target"
});

f.render({
    ftlFile: "/**/*.ftl",
    callback: function (error, stdout, stderr, fileName) {
        console.log(fileName + " is done");
    },
    done: function() {}
});
```

it will do find the match one and compile it, then put it into targetPath.
if you want extra tdd file(relative to tddPath), you can add it's path(string or Array) when you call render. like :

```js
f.render({
    ftlFile: "/**/*.ftl",
    tddFiles: "./extra.tdd"
});
```


## API

### recommand usage:

**just setup sourceRoot and dataRoot. it will find the same fileName in these path and covert it, more example in test.**

```js
var f = new ftl2html(initConfig);
```

initConfig parameter:

- sourceRoot: freemarker template folder path **(require)**
- dataRoot: mock data folder path **(require)**
- outputRoot: save converted html path **(require)**
- isDebug: set true will print every fmpp command before execute, default is false
- javaPath: use specify java if you need, default is "java"
- jarPath: use specify fmpp.jar if you need, default is jar in module 
- async: convert ftl async or not, default is true
- tddFiles: common tdd file for all ftl convert
- logFile: fmpp convert log, default is none
- configFile: any extra fmpp config


```js

f.render({
    ftlFile: "./normal.ftl",
    callback: function(error, stdout, stderr, fileName) {
        console.log(fileName);
    },
    done: function() {
        console.timeEnd("t")
    }
});
```

- ftlFile: covert ftl file name, relative to sourceRoot
- callback: every ftl coverted will be call
- done: all ftl coverted will be call

render method will extend it's config with initConfig, any common config should be put in initConfig.

### compatible usage:

for some old project, won't update.

```js
var ftl2html = require('ftl2html');

// compile
ftl2html(ftlPath, outputPath, ftlFileName, tddFiles, logFile);
```
- ftlPath: freemarker template file path
- outputPath: convert to html save path
- ftlFileName: freemarker template file name, relative to ftlPath
- tddFiles: mock data file(reference fmpp manual)
- logFile: fmpp convert log, default is none 

extend freemarker syntax

```js
var user = ${JSONObject.fromObject(userObj)};
var fids = ${JSONArray.fromObject(userArr)};
```

## Syntax

It just like freemarker syntax with a little extend.  Here is a simple example:

```freemarker
<i>${test1}</i><i>${test2!"no"}</i><i>${common}</i>
```
combine data

```json
{
    "test1": "test1",
    "common": "common"
}
```
become
```html
<i>test1</i><i>no</i><i>common</i>
```

## Node.js Support

4+

## Manual

[Freemarker Manual](http://freemarker.org/docs/index.html)

[Fmpp Manual](http://fmpp.sourceforge.net/manual.html)

## License

MIT