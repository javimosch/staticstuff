var heParser = require('./he.utils.html-parser');
var heUtils = require('./he.utils');
var minify = require('minify-content');
var heConfig = require('./he.config');

var babel = require("babel-core");




var g = {
	destFilename: 'app.js'
}
var PATH = './src/js';
var DIST = './dist/js';
var DEST_FOLDER = 'js';

function watch() {
	console.log('LOG scripts watch',PATH);
	heUtils.watch(PATH, () => {
		build();
	});
}

function build() {
	/*
	heUtils.copyFilesFromTo(PATH,DIST,{
		formatPathHandler: (path) => {
            return path;
        },
		formatContentHandler:(raw)=>{
			return raw; //less, sass, stylus here.
		}
	});*/

	var raw = heUtils.concatenateAllFilesFrom(PATH, {
		debug: false
	});

	console.log('ss debug scripts build before chars len', raw.length && raw.length || null);

	if (process.env.PROD.toString() == '1') {

		/*
		minify(raw,'js',(_raw)=>{
			_raw = _raw.code;
			build_next(_raw);
		})*/

		var r = babel.transform(raw, {
			presets: ["es2015"],
			minified: true,
			comments: false
		});
		build_next(r.code);
		console.log('debug scripts build after chars len', r && r.code && r.code.length || null);
	}
	else {
		build_next(raw);
	}

	function build_next(_raw) {
		heConfig().jsVendorFileName = g.destFilename;
		var dest = heConfig().output(DEST_FOLDER + '/' + g.destFilename);
		heUtils.createFile(dest, _raw);
		console.log('debug scripts build ' + g.destFilename + ' success at ' + new Date());
		emit('build-success');
	}
}


function emit(evt, p) {
	_events[evt] = _events[evt] || [];
	_events[evt].forEach(handler => handler(p));
}
var _events = {};

module.exports = {
	path: (p) => PATH = p,
	dest: (dest) => DIST = dest + '/' + DEST_FOLDER,
	build: build,
	watch: watch,
	on: (evt, handler) => {
		_events[evt] = _events[evt] || [];
		_events[evt].push(handler);
	}
};
