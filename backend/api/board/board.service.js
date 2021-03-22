const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find().toArray();
        if (boards.length === 0){
            boards = await save({});
        }

        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}


async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board');
        const board = await collection.findOne({ _id: ObjectId(boardId) });
        console.log(board);
        return board;
    } catch (err) {
        throw err;
    }
}

async function remove(boardId) {
    try {
        // const store = asyncLocalStorage.getStore();
        const collection = await dbService.getCollection('board')
        const query = { _id: ObjectId(boardId) }
        await collection.deleteOne(query)
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function save(board) {
    console.log('board:', board)
    try {
        let savedBoard = null;
        const collection = await dbService.getCollection('board');
        if (board._id) {
            const boardToUpdate = { ...board };
            delete boardToUpdate._id;
            await collection.updateOne({ _id: ObjectId(board._id) }, { $set: { ...boardToUpdate } });
            return board;
        } else {
            const newBoard = _getEmptyBoard()
            savedBoard = await collection.insert(newBoard);
            return savedBoard.ops[0];
        }
    } catch (err) {
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

function _getEmptyBoard() {
    const newBoard = {
        "title": "New Board",
        "style": {
            "bgColor": "#b1c294"
        },
        "labels": [
            {
                "id": "l101",
                "title": "",
                "color": "green"
            },
            {
                "id": "l102",
                "title": "",
                "color": "yellow"
            },
            {
                "id": "l103",
                "title": "",
                "color": "orange"
            },
            {
                "id": "l104",
                "title": "",
                "color": "red"
            },
            {
                "id": "l105",
                "title": "",
                "color": "purple"
            },
            {
                "id": "l106",
                "title": "",
                "color": "blue"
            }
        ],
        "createdAt": Date.now(),
        "groups": [
            {
                "id": createRandomId(),
                "title": "New Group",
                "tasks": []
            }
        ]
    }
}

function _createRandomId(){
    return '_'+Math.random().toString(36).substr(2, 12);
}

module.exports = {
    query,
    remove,
    save,
    getById
}


