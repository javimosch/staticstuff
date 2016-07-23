//var express = require('express');
var argv = require('yargs').argv;
var heBuild = require('./lib/he').build;
var heWatch = require('./lib/he').watch;
var heOptions = require('./lib/he').options;
var heLoads = require('./lib/he').load;
var heConfig = require('./lib/he.config');
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var config = require(process.cwd() + '/config');
//console.log('ENV',process.env.app);
//console.log('ARGV1',process.argv.app);
//console.log('ARGV2',argv.ap);
var APPNAME = argv.app || process.env.app || config.app;
config.app = APPNAME;
console.log('APP', APPNAME);



heOptions.setApp(config.app, config.apps[config.app]);

heOptions.dest('dist', 'dist-production');
console.log('OUTPUT',heConfig().output());
console.log('DATA-ROOT',heConfig().root);
heBuild.all().then(() => {
  if (process.env.PROD == 1) {
    console.log('staticstuff build success for production');
    process.exit(0);
    return;
  }
  console.log('staticstuff watch start');
  heWatch.templates();
  heWatch.scripts();
  heWatch.styles();
  console.log('staticstuff watch ready');
});
//console.log(process.env.src||'no-src-specified');
