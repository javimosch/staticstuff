var PROD = process.env.PROD && process.env.PROD.toString() == '1' || false;
console.log('he config prod', PROD == true);
var _data = {
    outputBaseDir: function() {
        var rta = process.cwd();
        if (PROD) {
            rta += '/' + _data.dest_production || 'dist-production';
        }
        else {
            rta += '/' + _data.dest || 'dist';
        }
        return rta.replaceAll('//', '/');
    },
    output: function(path) {
        var rta = "";
        if (PROD) {
            rta += _data.outputBaseDir();
        }
        else {
            rta += _data.outputBaseDir() + '/' + _data.appName;
        }
        if (path) {
            rta += '/' + path;
        }
        return rta.replaceAll('//', '/');
    }
};

module.exports = function(data) {
    Object.assign(_data, data);
    _data.PROD = (process.env.PROD.toString()=='1' && true) || false;
    return _data;
};