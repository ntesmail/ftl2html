# ftl2html

Node.js module invoke fmpp convert freemarker and data to html.

**You need to Install Java Runtime Environment(JDK) 1.4+ first.**

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
ftl2html(sourceRoot, outputRoot, ftlFile, tddFiles, logFile);
```

extend syntax
```js
var user = ${JSONObject.fromObject(user)};
var fids = ${JSONArray.fromObject(user.lockStatus.fids)};
```

## Node.js Support

0.12+

## Manual

[Freemarker Manual](http://freemarker.org/docs/index.html)

[Fmpp Manual](http://fmpp.sourceforge.net/manual.html)

## License

MIT