require('dotenv').config();
var express = require('express');
var path = require("path");
var app = express();
var http = require('http').Server(app);
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var port = process.env.PORT || 3000;
var config = require('./config.js');
var btoa = require('btoa');
var fs = require('fs');



//CORS
app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-PUSH");
	//console.log(req.method, 'Setting CORS');
	if ('OPTIONS' == req.method) {
		return res.send(200);
	}
	next();
});



//
function getPath(s) {
	try {
		return fs.realpathSync(s);
	}
	catch (e) {
		return false;
	}
}

function replaceAll(target, search, replacement) {
	return target.replace(new RegExp(search, 'g'), replacement);
};
//
var appStaticResPaths = ['img', 'fonts', 'images', 'includes', 'files'];
appStaticResPaths.forEach(n => {
	Object.keys(config.apps).forEach(appName => {
		var path = getPath(process.cwd() + '/src/res/' + appName + '/' + n);
		if (path == false) return;
		var route = '/' + appName + '/' + n;
		app.use(route, express.static(path));
		console.log('static-content - routing ' + route);

		app.get('/' + appName + '/partial/:name', function(req, res) {
			var name = req.params.name;
			var url = req.protocol + '://' + req.get('host');


			//var html = fs.readFileSync(process.cwd() + '/src/res/' + appName + '/includes/' + name);

			fs.readFile(process.cwd() + '/src/res/' + appName + '/includes/' + name,'utf-8', function(err, page) {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				if(err) {
					page = 'error';
					console.log(err);
				}
				res.write(replaceAll(page, 'href="', 'href="' + url + '/'+appName+'/partial/'));
				res.end();
			});

			//res.sendFile(process.cwd() + '/src/res/' + appName + '/includes/' + name);
		});


	});
});

var _route = '';
Object.keys(config.apps).forEach(appName => {
	_route = '/' + appName + '/src';
	app.use(_route, express.static('./src'));
	console.log('static-content - src - routing ' + _route);

	_route = '/' + appName + '/vendor';
	app.use(_route, express.static('./vendor'));
	console.log('static-content - vendor - routing ' + _route);
});

//
var dest = 'dist';
if (PROD) {
	dest = 'dist-production';
}







app.use('/', express.static('./' + dest));

app.use('/prod', express.static('./dist-production'));

app.use('/src', express.static('./src'));
app.use('/res', express.static('./src/res'));
app.use('/vendor', express.static('./vendor'));

app.get('/config', function(req, res) {
	var LIVE = process.env.STRIPE_LIVE && process.env.STRIPE_LIVE.toString() == '1' || false;
	var config = {
		STPK: (LIVE) ? process.env.STPK : process.env.STTPK
	};
	if (process.env.serverURL) {
		config.serverURL = process.env.serverURL;
	}
	var payload = {
		config: btoa(JSON.stringify(config))
	};
	res.setHeader('Content-type', 'text/plain');
	res.charset = 'UTF-8';
	res.write(btoa(JSON.stringify(payload)));
	res.end();
});

if (process.env.ENABLE_WS && process.env.ENABLE_WS.toString() === '1') {
	require('./lib/ws/ss-ws-main').configure(http);
	console.log('ss websocket enabled.');
}

http.listen(port, function() {
	console.log('static-content - Production? ' + (PROD ? 'Oui!' : 'Non!'));
	console.log('static-content - serverURL', process.env.serverURL || 'http://localhost:5000');
	console.log('static-content - listening on port ' + port + '!');
});
