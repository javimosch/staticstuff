var ioFunction = require('socket.io');

var ssTree = require('./ss-ws-tree');

function configure(http) {
    var io = ioFunction(http);
    io.on('connection', function(socket) {
        console.log('a user connected');

        registerEvents(io, socket);



    });
}

function registerEvents(io, socket) {
    socket.on('GET_TREE', function(data) {
        console.log('GET_TREE name: ' + data.name);
        var rta = ssTree.ssFolder(data.appName,data.type);
        console.log('GET_TREE',rta);
        io.emit('GET_TREE', rta);
    });
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
}

module.exports = {
    configure: configure
};
