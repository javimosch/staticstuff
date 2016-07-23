var heParser = require('./he.utils.html-parser');
var heUtils = require('./he.utils');
var Handlebars = require('handlebars');
var readDirFiles = require('read-dir-files');
var mkdirp = require('mkdirp');
var fs = require('fs');
var heConfig = require('./he.config');
var COMMON_PATH = process.cwd() + '/src/partials/common';
var SRC = './src/static';
//var DIST = './dist';
var PATH = './src/partials';
var PARTIALS_EXT = 'html';
var partials = null;


Handlebars.registerHelper('file', function(options) {
    var p = options.fn(this);
    var raw = fs.readFileSync(process.cwd() + p)
    return raw;
});


var _watches = {};

function dataFromRequire(filePath, propertyName) {
    var data = {};
    if (propertyName) {
        data = require(filePath)[propertyName];
    }
    else {
        data = require(filePath);
    }
    loadData(data);

    if (typeof _watches[filePath] === 'undefined') {
        _watches[filePath] = true;
        try {
            heUtils.watch([filePath + '.js'], () => dataFromRequire(filePath, propertyName));
        }
        catch (e) {
            console.log('debug-warning', 'watch hook failed', e);
        }
    }
}

function loadData(d) {
    //Object.assign(data, d);
}

function loadDataJSON(path) {
    //var data = fs.readFileSync(path);
    //loadData(JSON.parse(data));
}

var _events = {};

module.exports = {
    pathPartials: (p) => PATH = p,
    pathStatic: (p) => SRC = p,
    dataFromRequire: dataFromRequire,
    loadData: loadData,
    loadDataJSON: loadDataJSON,
    dest: (dest) => {
        //DIST = dest;
    },
    watch: () => {
        watchPartials();
        watchSrc();
    },
    build: () => {
        // console.log('TEMPLATES:BUILD');
        return new Promise((resolve, error) => {
            // console.log('TEMPLATES:BUILD:PARTIALS');
            buildTemplatesPartials(COMMON_PATH);
            buildTemplatesPartials();
            console.log('TEMPLATES:BUILD:STATIC');
            buildTemplates().then(()=>{
                console.log('TEMPLATES:BUILD:STATIC:DONE');
                resolve();
            });
        });
    },
    on: (evt, handler) => {
        _events[evt] = _events[evt] || [];
        _events[evt].push(handler);
    }
}

function emit(evt, p) {
    _events[evt] = _events[evt] || [];
    _events[evt].forEach(handler => handler(p));
}

function watchSrc() {
    console.log('Waching Static Folder: ' + SRC);
    heUtils.watch(SRC, () => {
        buildTemplates();
    });
}

function watchPartials() {
    console.log('Waching Partials Folder: ' + PATH);
    heUtils.watch(PATH, () => {
        buildTemplatesPartials(COMMON_PATH);
        buildTemplatesPartials();
        buildTemplates();
    });
}

function buildTemplatesPartials(src, append) {
    
    //console.log('LOG tpl partials src',src||PATH);
    if(!fs.existsSync(src || PATH)) return console.log('LOG tpl partials skip for',src || PATH);
    partials = heUtils.normalizeFilesTree(readDirFiles.readSync(src || PATH));
    //console.log('LOG tpl partials fixing');
    partials = heUtils.filesIncludeOnly(partials, PARTIALS_EXT);
    var name;
    //console.log('LOG tpl partials len',Object.keys(partials).length);
    Object.keys(partials).forEach(k => {
        name = k.substring(0, k.lastIndexOf('.') !== -1 && k.lastIndexOf('.') || undefined);
       // console.log('LOG tpl partials name',name);
        Handlebars.registerPartial(name, partials[k]);
    });
}

function compileTemplates(src, path) {
    //console.log('Compiling', path);
    var rta = Handlebars.compile(src)(heConfig());
    return rta;
}


var vendorData = {};

function vendorChanges(path, arr) {
    if (!vendorData[path]) {
        vendorData[path] = arr;
        return true;
    }
    else {
        if (arr.length !== vendorData[path].length) {
            vendorData[path] = arr;
            return true;
        }
        else {

            for (var x in vendorData[path]) {
                if (vendorData[path][x] !== arr[x]) {
                    vendorData[path] = arr;
                    return true;
                }
            }
            return false;
        }
    }
}

function compileVendorCustom(opt) { //{{root}}
    var raw = opt.content,
        path = opt.path,
        ext = opt.ext,
        replaceCb = opt.replaceWith,
        tagName = opt.tagName,
        tagAttributeName = opt.tagAttribute;
    //
    var outputFileName = opt.outputFileName || 'vendor';
    var sectionName = opt.sectionName || ('VENDOR-' + ext.toUpperCase());
    if (heParser.hasSection(sectionName, raw)) {
        var buildPath = heConfig().output(ext + '/' + outputFileName + '.' + ext);
        buildPath = buildPath.replaceAll('//', '/');
        var sectionRaw = heParser.getSection(sectionName, raw);
        var arr = heParser.readTags(sectionRaw, tagName, tagAttributeName);
        //
        var _url = heConfig().root + '/' + ext + '/' + outputFileName + '.' + ext;
        _url = _url.replaceAll('//', '/');
        //console.log('he script vendor url',_url);
        var _replaceWith = replaceCb(_url);
        //console.log('he script vendor section',_replaceWith);
        //
        arr = arr.map(i => i = i.replace(heConfig().root, '/'));


        arr.forEach((path) => {
            emit('file-dependency', process.cwd() + '/' +
                path);
        });

        if (process.env.PROD && process.env.PROD.toString() === '1') {

        }
        else {
            return raw; //do not remplace on dev env
        }

        if (!vendorChanges(ext, arr)) {
            return heParser.replaceSection(sectionName, raw, _replaceWith);
        }

        var compiledCode = heUtils.concatenateAllFilesFromArray(arr);
        if (opt.middleWare) {
            compiledCode = opt.middleWare(compiledCode);
        }
        heUtils.createFile(buildPath, compiledCode);
        console.log('he scripts vendor ' + buildPath + ' success at '); // + new Date());
        raw = heParser.replaceSection(sectionName, raw, _replaceWith);
        return raw;
    }
    else {
        return raw;
    }
}

function compileVendorCSS(raw, path) {
    return compileVendorCustom({
        content: raw,
        path: path,
        ext: 'css',
        replaceWith: dest => {
            return "<link rel='stylesheet' href='" + dest + "' type='text/css' />";
        },
        tagName: 'link',
        tagAttribute: 'href',
        middleWare: _raw => {
            //heStyles.minify(_raw);
            return _raw;
        }
    });
}

function compileVendorJS(raw, path) {
    return compileVendorCustom({
        content: raw,
        path: path,
        ext: 'js',
        replaceWith: dest => {
            return '<script src="' + dest + '"></script>';
        },
        tagName: 'script',
        tagAttribute: 'src',
        middleWare: _raw => {
            //heStyles.minify(_raw);
            return _raw;
        }
    });
}

function compileSectionBundles(raw, path) {
    var has = true;
    for (var x = 0; x < 10; x++) {
        if (has && heParser.hasSection('BUNDLE_JS_' + (x + 1), raw)) {
            raw = compileVendorCustom({
                outputFileName: 'bundle_' + x,
                sectionName: 'BUNDLE_JS_' + (x + 1),
                content: raw,
                path: path,
                ext: 'js',
                replaceWith: dest => {
                    return '<script src="' + dest + '"></script>';
                },
                tagName: 'script',
                tagAttribute: 'src',
                middleWare: _raw => {
                    //heStyles.minify(_raw);
                    return _raw;
                }
            });
            //console.log('ss debug templates make bundle ' + (parseInt(x) + 1));
        }
        else {
            has = false;
        }
    }
    return raw;
}

function buildTemplates() {
    return new Promise((resolve, error) => {


        if (partials == null) {
            //not ready yet;
            return;
        }

        console.log('TEMPLATES:BUILD:STATIC', heConfig().output());


        //console.log('ss debug templates building to ['+heConfig().output()+']');

        heUtils.copyFilesFromTo(SRC, heConfig().output(), {
            formatPathHandler: (path) => {
                if (path.indexOf('index') !== -1) {
                    path = path.substring(0, path.lastIndexOf('index')) + 'index.html';
                }
                return path;
            },
            formatContentHandler: (raw, path) => {

                try {
                    var rta = Handlebars.compile(raw)(heConfig());

                    // if (process.env.PROD && process.env.PROD.toString() === '1') {
                    rta = compileVendorJS(rta, path);
                    rta = compileVendorCSS(rta, path);
                    rta = compileSectionBundles(rta, path);
                    //console.log('Compiling', path);
                    // }
                    // else {
                    //rta = compileVendorJS(rta, path);
                    //rta = compileVendorCSS(rta, path);
                    // console.log('Compiling', path, 'Prod:', process.env.PROD);
                    //}

                }
                catch (e) {
                    rta = raw;
                    //console.log('Compiling fail',e);
                    throw e;
                }

                //console.log('building templates writing',rta.length,'chars...');

                return rta;

            }
        }).then((res) => {
            console.log('he templates build ' + (res.ok ? 'success' : 'with errors') + ' at ' + new Date());
            emit('build-success');
            resolve();
        })
    });

}
