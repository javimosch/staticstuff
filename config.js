var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var fs = require('fs');
var configsFileNames = fs.readdirSync(process.cwd() + '/configs');
var config = {
	app: 'rich', //default app
};
configsFileNames.forEach(path => {
	var n = path.replace('.js', '').replace('config-', '');
	console.log('loading config ' + n);
	config.apps = config.apps||{};
	config.apps[n] = require(process.cwd() + '/configs/' + path);
	if (!config.apps[n].root) {
		if (PROD) {
			config.apps[n].root = '/';
		}
		else {
			config.apps[n].root = '/' + n + '/';
		}

	}
	if (!config.apps[n].res) {

		if (PROD) {
			config.apps[n].res = '/';
		}
		else {
			config.apps[n].res = '/' + n + '/';
		}
	}
	//console.log(config.apps[n]);
});
module.exports = config;


/*

var ver = {
	STRIPE_CDN: [
		"https://code.jquery.com/jquery-2.2.2.min.js",
		"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js",
		"https://cdn.firebase.com/js/client/2.2.4/firebase.js",
		"https://checkout.stripe.com/checkout.js"
	],
	STRIPE: [
		'src/vendor/vendor.angular.unzip.js',
		'src/vendor/peso-utils.js',
	],
	JS: [
		'src/vendor/vendor.angular.unzip.js',
		'src/vendor/vendor.angular-route.min.js',
		'src/vendor/vendor.moment.js',
		'src/vendor/vendor.geocomplete.js',
		'src/vendor/vendor.lodash.js',
		'src/vendor/peso-utils.js'
	],
	CSS_MANITAS: [
		'bijou.css',
		'helper.css',
		'manitas.css'
	],
	VENDOR_CDN: [
		"https://code.jquery.com/jquery-2.2.2.min.js",
		"https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.3/angular.js",
		"https://cdn.firebase.com/js/client/2.2.4/firebase.js",
		"https://cdn.firebase.com/libs/angularfire/1.2.0/angularfire.min.js"
	],
	MANITAS: {
		images: {
			manos: 'http://honeypoppies.com/2906-thickbox_default/sello-madera-manitas.jpg'
		}
	}
};
deploy: {
		credentials: {
			username: 'javi@misitioba.com',
			password: undefined,
			host: 'ftp.misitioba.com'
		},
		manitasRes: {
			from: 'src/res/manitas',
			to: 'res/manitas'
		},
		manitas: {
			root: "/manitas",
			from: "dist_ftp/manitas",
			to: "manitas"
		},
		misitioba: {
			root: "",
			from: "dist/misitioba",
			to: ""
		}
	}
	*/