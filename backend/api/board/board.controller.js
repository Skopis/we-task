const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const socketService = require('../../services/socket.service')
const boardService = require('./board.service')

async function getBoards(req, res) {
    try {
        const boards = await boardService.query(req.query)
        res.send(boards)
    } catch (err) {
        logger.error('Cannot get boards', err)
        res.status(500).send({ err: 'Failed to get boards' })
    }
}
async function getBoardById(req, res) {
    try {
        const { boardId } = req.params;
        const board = await boardService.getById(boardId);
        res.send(board);
    } catch (err) {
        res.status(401).send({ err: "Board doesn't exist" });
    }
}

async function deleteBoard(req, res) {
    try {
        await boardService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete board', err)
        res.status(500).send({ err: 'Failed to delete board' })
    }
}


async function addBoard(req, res) {
    try {
        var board = req.body
        console.log(board);
        // board.byUserId = req.session.user._id
        board = await boardService.save(board)
        console.log('CTRL SessionId:', req.sessionID);
        // socketService.broadcast({ type: 'board-added', data: board })
        // socketService.emitToAll({ type: 'user-updated', data: board.byUser, room: req.session.user._id })
        res.send(board)

    } catch (err) {
        console.log(err)
        logger.error('Failed to add board', err)
        res.status(500).send({ err: 'Failed to add board' })
    }
}

async function updateBoard(req, res) {
    // console.log('body',req.body);
    // console.log('query',req.query);
    try {
        const board = req.body;
        const savedBoard = await boardService.save(board);
        res.send(savedBoard);
    } catch (err) {
        res.status(401).send({ err: 'Board doesn\'t exist' })
    }
}

module.exports = {
    getBoards,
    deleteBoard,
    addBoard,
    getBoardById,
    updateBoard
}