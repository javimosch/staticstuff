var heParser = require('./he.utils.html-parser');
var heUtils = require('./he.utils');
var fs = require('fs');

var DIST = process.cwd()+'dist/misitioba';
var data = {
    root:'/misitioba'
};


function compileVendorCustom(raw, path, ext, replaceCb, tagName, tagAttributeName) { //{{root}}
    var sectionName = 'VENDOR-' + ext.toUpperCase();
    if (heParser.hasSection(sectionName, raw)) {
        var buildPath = DIST + '/' + ext + '/vendor.' + ext;
        var sectionRaw = heParser.getSection(sectionName, raw);
        var arr = heParser.readTags(sectionRaw, tagName, tagAttributeName);
        arr.forEach(v => {
            console.log('parsing-vendor', v);
        });
        arr = arr.map(i => i = i.replace(data.root, '/'));
        var script = heUtils.concatenateAllFilesFromArray(arr);
        arr.forEach(v => {
            console.log('building-vendor', v);
        });
        heUtils.createFile(buildPath, script);
        console.log('Building ' + buildPath + ' success at ' + new Date());
        raw = heParser.replaceSection(sectionName, raw, replaceCb(data.root + '/' + ext + '/vendor.' + ext));
        return raw;
    }
    else {
        console.log('Build section skip for ', path);
        return raw;
    }
}

function compileVendorCSS(raw, path) {
    return compileVendorCustom(raw, path, 'css', dest => {
        return "<link rel='stylesheet' href='"+dest+"' type='text/css' />";
    },'link','href');
}
function compileVendorJS(raw, path) {
    return compileVendorCustom(raw, path, 'js', dest => {
        return '<script src=' + dest + '></script>', 'script', 'src';
    },'script','src');
}


var path = process.cwd() + '/dist/misitioba/index.html';
var raw = fs.readFileSync(path, 'utf8');//test

raw = compileVendorCSS(raw,path);

console.log(raw);