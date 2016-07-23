var path = require("path");
var sander = require('sander');

var basedir = process.cwd()+'/dist-production';
var fileName = 'test.js';
var content = '//test';
console.log('util-createFile', basedir, fileName, content.length, ' characters');
return sander.writeFile(basedir, fileName, content);