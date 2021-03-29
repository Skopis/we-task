

const asyncLocalStorage = require('./als.service');
const logger = require('./logger.service');

var gIo = null;
var gSocketBySessionIdMap = {};
var gUsers = [];

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
    const sharedSession = require('express-socket.io-session');
    gIo.use(sharedSession(session, {
        autoSave: true
    }));
    gIo.on('connection', socket => {
        console.log("Someone join the socket");
        // console.log(socket);
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket
        console.log(socket.handshake.sessionID);
        socket.on('disconnect', socket => {
            console.log('Someone disconnected')
            if (socket.handshake) {
                gSocketBySessionIdMap[socket.handshake.sessionID] = null
                removeIdFromList(socket.id)
            }
        })
        socket.on('board id', ({ board, user }) => {
            if (user) gUsers.push({ socketId: socket.id, fullname: user.fullname, userId: user._id })
            if (socket.myBoard === board) return;
            if (socket.myBoard) {
                socket.leave(socket.myBoard)
            }
            socket.join(board)
            socket.myBoard = board
        })
        socket.on('board change', board => {
            console.log("someone changed the board");
            socket.broadcast.to(socket.myBoard).emit('updated board', board);

        })
        socket.on('task-added', fullname => {
            const userIdx = gUsers.findIndex(user =>{
                return user.fullname === fullname
            })
            if (userIdx !== -1){
                console.log('user found');
                socket.to(gUsers[userIdx].socketId).emit("task-added-2u", 'suprise')
            }else{
                console.log('user not found');
            }
        })

    })
}

function emit({ type, data }) {
    gIo.emit(type, data)
}

// TODO: Need to test emitToUser feature
function emitToUser({ type, data, userId }) {
    gIo.to(userId).emit(type, data)
}


// Send to all sockets BUT not the current socket 
function broadcast({ type, data }) {
    const store = asyncLocalStorage.getStore()
    const { sessionId } = store
    if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
    const excludedSocket = gSocketBySessionIdMap[sessionId]
    if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map', gSocketBySessionIdMap)
    excludedSocket.broadcast.emit(type, data)
}

function removeIdFromList(socketId) {

}


module.exports = {
    connectSockets,
    emit,
    broadcast
}



