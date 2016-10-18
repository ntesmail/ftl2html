ftl2html
=====

A convertor for freemarker developer

Example:

var ftl2html = require('ftl2html');

var sourceRoot = '/Users/hero/shark/ftl2html/src/main/webapp/WEB-INF',
    outputRoot = '/Users/hero/shark/ftl2html/build', 
    ftlFile = 'tmpl/main.ftl', 
    tdd = '/Users/hero/shark/ftl2html/src/test/mock/tdd/main.tdd,/Users/hero/shark/ftl2html/src/test/mock/tdd/oglobal.tdd';
ftl2html(sourceRoot, outputRoot, ftlFile, tdd)

```