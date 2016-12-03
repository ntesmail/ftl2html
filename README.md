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
becomes
```html
<i>test1</i><i>no</i><i>common</i>
```

## API


```js
var ftl2html = require('ftl2html');

// compile
ftl2html(ftlPath, outputPath, ftlFileName, tddFiles, logFile);
```
- ftlPath: freemarker template file path
- outputPath: convert to html save path
- ftlFileName: freemarker template file name, relative to ftlPath
- tddFiles: mock data file(reference fmpp manual)
- logFile(optional): fmpp convert log, default is ./fmpp.log 

extend freemarker syntax

```js
var user = ${JSONObject.fromObject(userObj)};
var fids = ${JSONArray.fromObject(userArr)};
```

## Node.js Support

4+

## Manual

[Freemarker Manual](http://freemarker.org/docs/index.html)

[Fmpp Manual](http://fmpp.sourceforge.net/manual.html)

## License

MIT