var heUtils = require('./he.utils');
var heConfig = require('./he.config');
var g = {
	destFilename: 'app.css'
}
var PATH = './src/css';
var DIST = './dist/css';
var DEST_FOLDER = 'css';
function watch() {
	heUtils.watch(PATH, () => {
		build();
	});
}
function build() {
	var raw = heUtils.concatenateAllFilesFrom(PATH);
	var dest = heConfig().output(DEST_FOLDER+'/'+g.destFilename);
	heUtils.createFile(dest, raw);
	console.log('he styles build ' + g.destFilename + ' success at ' + new Date());
	emit('build-success');
}
var _events = {};
module.exports = {
	path: (p) => PATH = p,
	dest: (dest) => {},
	build: build,
	watch: watch,
	on: (evt, handler) => {
		_events[evt] = _events[evt] || [];
		_events[evt].push(handler);
	}
};
function emit(evt, p) {
	_events[evt] = _events[evt] || [];
	_events[evt].forEach(handler => handler(p));
}