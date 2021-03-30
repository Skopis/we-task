gUserMap = [];

function connectSockets(http, session) {
    gIo = require('socket.io')(http);
    const sharedSession = require('express-socket.io-session');
    gIo.use(sharedSession(session, {
        autoSave: true
    }));

    /*~~~Connect to the socket~~~*/
    gIo.on('connection', socket => {
        gSocketBySessionIdMap[socket.handshake.sessionID] = socket;

        /*~~~Disconnect from the socket~~~*/
        socket.on('disconnect', ({socket, userId}) => {
            const userIdx = gUsersMap.findIndex(user => user.id === userId);
            gUsersMap.splice(userIdx,1);
            if (socket.handshake) gSocketBySessionIdMap[socket.handshake.sessionID] = null;
        })

        /*~~~Called when some enter the board, it add him to get updates for the curr board~~~*/
        socket.on('board id', ({ board, user }) => {
            if (user) gUsersMap.push({ socketId: socket.id, fullname: user.fullname, userId: user._id });
            if (socket.myBoard === board) return;
            if (socket.myBoard) socket.leave(socket.myBoard);
            socket.join(board);
            socket.myBoard = board;
        })

        /*~~~Called when board changes in the front and broadcast it to the rest of the people on the same board~~~*/
        socket.on('board change', board => { 
            socket.broadcast.to(socket.myBoard).emit('updated board', board);
        })

        /*~~~Called when a task is called, checks if the currect user is connected if so it sends notification~~~*/
        socket.on('task-added', ({ userId, senderName }) => {
            const userIdx = gUsersMap.findIndex(user => user.id === userId)
            if (userIdx !== -1) socket.to(gUsersMap[userIdx].socketId).emit("task-added-2u", senderName)
        })
    })
}
