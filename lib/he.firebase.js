var firebase = require("firebase");
var fs = require('fs');
var ref,appName;
var heConfig = require('./he.config');
module.exports = {
    init: (data) => {
        appName = data.appName;
        var fireApp = firebase.initializeApp({
            serviceAccount: process.cwd() + "/staticstuff-4f6deb0b3333.json",
            databaseURL: "https://project-8364615376455036555.firebaseio.com"
        });
        
        console.log('LOG firebase signalName',data.signalName);
        
        data.signalName = data.signalName || data.appName;
        
        ref = fireApp.database().ref(data.signalName||data.appName);
    },
    sendSignal: (evt) => {
        var payload = {};
        payload[evt] = new Date().getTime();
        ref.child('signals').update(payload);
        console.log('Sending signal to ' + heConfig().signalName||heConfig().appName,JSON.stringify(payload));
    }
}
