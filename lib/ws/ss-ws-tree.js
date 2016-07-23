var dirTree = require('directory-tree');

var heConfig = require('../he.config');

module.exports = {
    tree:(path)=>{
        return dirTree(path);
    },
    ssFolder:(appName,type)=>{
        var path = process.cwd()+'/src/'+type+'/'+appName;
        console.log('ss debug ss-ws-tree config keys',Object.keys(heConfig()));
        console.log('ss debug ss-ws-tree ssFolder : path',path);
        return dirTree(path);
    }
};