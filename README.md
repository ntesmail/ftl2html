# ftl2html

Node.js module invoke fmpp convert freemarker and data to html.

**You need to Install Java Runtime Environment(JRE) 1.4+ first.**

## Installation

via npm:

```bash
$ npm install ftl2html
```

## Syntax

ftl2html is a clean, no dependency module for covert freemarker to html.  Here is a simple example:

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