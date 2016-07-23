require('dotenv').config();
var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
var btoa = require('btoa');
//////------------
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
//////------------
console.log(JSON.stringify(config));
console.log('');
console.log(btoa(JSON.stringify(payload)));
