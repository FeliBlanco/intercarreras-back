const { Server } = require("socket.io");

let io = null;

function socketConnect(server) {
    io = new Server(server, {cors:{origin:'*'}});

    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}

function getIO() {
    return io;
}

module.exports = {
    socketConnect,
    getIO
}
