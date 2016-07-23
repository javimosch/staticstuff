var argv = require('yargs').argv;
var FtpDeploy = require('ftp-deploy');
var ftpDeploy = new FtpDeploy();
var fs = require('fs');
var config = require(process.cwd() + '/config');

var heBuild = require('./he').build;
var heOptions = require('./he').options;
var heLoads = require('./he').load;
var heUtils = require('./he.utils');


var g = {
    dest: process.cwd() + '/dist_ftp'
};

var ftpConfig = {
    username: config.deploy.credentials.username,
    password: process.env.ftpPass || config.deploy.credentials.password || undefined,
    host: config.deploy.credentials.host,
    port: 21,
    localRoot: process.cwd() + "/",
    remoteRoot: "/",
    exclude: ['.git', '.idea', 'tmp/*']
}

var target = argv.target;
if (target) {
    if (config.deploy[target]) {
        ftpConfig.localRoot += config.deploy[target].from;
        ftpConfig.remoteRoot += config.deploy[target].to;
        if (validations()) {
            return compileUpload();
        }
    }
}
else {
    validations();
}
console.log('debug-deploy-nothing-happens');

function validations() {
    if (!argv.target) {
        var targets = Object.keys(config.deploy).filter(k => k !== 'credentials');
        console.log('deploy require target argument(0)', 'Configured targets', targets, argv);
        return false;
    }
    if (ftpConfig.remoteRoot === '/') {
        console.log('deploy to / not allowed');
        return false;
    }
    return true;
}

function compileUpload() {
    heLoads.dataFromRequire(process.cwd() + '/config');
    if (config.deploy[target].root) {
        heLoads.data({
            root: config.deploy[target].root
        });
    }
    heOptions.dest(g.dest);
    console.log('debug-deploy-compiling-to-specific-root', config.deploy[target].root||config.root);
    heBuild.all().then(() => {
        upload();
        //console.log('debug-deploy-compile-success');
    });
}


function upload() {
    console.log('params', argv);
    console.log('ftpConfig', ftpConfig);
    if (argv.now) {
        console.log('debug-deploy-start');

        ftpDeploy.on('upload-error', function(data) {
            console.log('debug-deploy-error', data.err); // data will also include filename, relativePath, and other goodies
        });

        ftpDeploy.on('uploading', function(data) {
            //data.totalFileCount; // total file count being transferred
            //data.transferredFileCount; // number of files transferred
            //data.percentComplete; // percent as a number 1 - 100
            //data.filename; // partial path with filename being uploaded
            //console.log('deploy', data.filename, data.percentComplete + ' %', data.transferredFileCount + '/' + data.totalFileCount);
        });
        ftpDeploy.on('uploaded', function(data) {
            //console.log(data); // same data as uploading event
            console.log('deploy', data.filename, 'uploaded');
        });

        ftpDeploy.deploy(ftpConfig, function(err) {
            if (err) console.log(err)
            else {
                console.log('debug-deploy-success');

                heUtils.deleteFiles([g.dest + '/**/*.*']).then(() => {
                    heUtils.deleteFiles([g.dest]).then(() => {
                        process.exit(0);
                    });
                });

            }


        });
    }
}
