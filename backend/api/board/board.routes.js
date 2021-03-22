const express = require('express')
// const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const { addBoard, getBoards, deleteBoard, getBoardById ,updateBoard } = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoards) // get All
router.get('/:boardId', getBoardById); // get One
router.post('/', addBoard) // add One
router.put('/:boardId', updateBoard); // update One
router.delete('/:id', deleteBoard);// delete One

module.exports = router