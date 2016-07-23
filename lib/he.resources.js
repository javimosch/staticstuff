var heUtils = require('./he.utils');
var heConfig = require('./he.config');
var heFirebase = require('./he.firebase');
module.exports = {
    watch: () => {
        var path = process.cwd() + '/src/res/' + heConfig().appName;
        console.log('debug RES watching ', path);
        heUtils.watch(path, () => {
            heFirebase.sendSignal('reload')
        });
    }
};
