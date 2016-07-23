var heStyles = require('./he.styles');
var heScripts = require('./he.scripts');
var heTpls = require('./he.templates');
var heUtils = require('./he.utils');
var heConfig = require('./he.config');
var heFirebase = require('./he.firebase');
var heRes = require('./he.resources');

var g = {
    dest: 'dist',
    src: './src/',
    fileDependencies: {}
};
exports.load = {
    dataFromRequire: heTpls.dataFromRequire,
    data: heTpls.loadData,
    json: heTpls.loadJSON
};

exports.options = {
    setApp: setApp,
    dest: (dest, destProduction) => {
        heConfig({
            dest: dest,
            dest_production: (destProduction || (dest + '-production'))
        });
        g.dest = dest;
        heStyles.dest(dest);
        heScripts.dest(dest);
        heTpls.dest(dest);
    }
};

exports.watch = {
    templates: () => {
        heTpls.on('build-success', () => heFirebase.sendSignal('reload'));


        heTpls.on('file-dependency', (path) => {
            if (!g.fileDependencies[path]) {
                g.fileDependencies[path] = true;
                path = path.replaceAll('//', '/');
                if(path.indexOf('vendor')!=-1) return;
                console.log('ss debug watch ', path);
                heUtils.watch([path], () => heFirebase.sendSignal('reload'));
            }
        });

        heRes.watch();

        heTpls.watch();
    },
    styles: () => {
        heStyles.on('build-success', () => heFirebase.sendSignal('reload'));
        heStyles.watch();
    },
    scripts: () => {
        heScripts.on('build-success', () => heFirebase.sendSignal('reload'));
        heScripts.watch();
    }
};

exports.build = {
    //clean: clean,
    all: build
};

function clean() {
    return new Promise((resolve, err) => {
        heUtils.deleteFiles([g.dest + '/**/*.*']).then(() => {
            heUtils.deleteFiles([g.dest]).then(() => {
                resolve();
            });
        });
    })
}

function build() {
    return new Promise((resolve, error) => {
        //heUtils.clear(heConfig().outputBaseDir(), ['**']);
        heUtils.clear(heConfig().output(), ['**']);
        setTimeout(function() {
            heScripts.build();
            heStyles.build();
            heTpls.build().then(() => {
                console.log('LOG main build all success at ' + new Date());
                resolve();
            });
        }, 500);
    });
}


function setApp(appName, appData) {
    appData.app = appName;
    appData.appName = appName;
    
    //console.log('LOG config '+JSON.stringify(appData));

    appData = heConfig(appData);

    heScripts.path(g.src + 'js/' + appName);
    heStyles.path(g.src + 'css/' + appName);
    heTpls.loadData(appData);
    heFirebase.init(appData);
    heTpls.pathPartials(g.src + 'partials/' + appName);
    heTpls.pathStatic(g.src + 'static/' + appName);
    console.log('Config loaded [' + appName + ']');
}