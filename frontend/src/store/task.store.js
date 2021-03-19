import { taskService } from '../services/task.service'
import {utilService} from'../services/util.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const taskStore = {
    state: {
        tasks: [],
        board: null,
        boards: null,
        currTaskActivities:null,
        currGroupId:null,
    },
    getters: {
        tasks(state) {
            return state.tasks;
        },
        getBoard(state) {
            return state.board
        },
        getBoardId(state){
            return state.board._id
        },
        getBoards(state) {
            return state.boards
        },
        taskActivities(state){
            return state.currTaskActivities
        }
    },
    mutations: {
        addBoard(state, {newBoard}){
            state.boards.push(newBoard)
            state.board = newBoard
        },
        updateBoard(state, {boardIdx, board}){
            console.log('boardIdx at 36', boardIdx)
            console.log('board at 37', board)//undefined!!
            state.boards.splice(boardIdx, 1, board)
        },
        setBoard(state, { board }) {
            // console.log('board at set board', board)
            state.board = board;
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id === taskId)
            console.log('task id after remove from storage:', taskId)
        },
        getTaskActivities(state, { taskId }) {
            var activities = state.board.activities.find(activity =>{
                if(activity.task.id === taskId) return activity
            })
            state.currTaskActivities = [activities]
        },
        saveCurrGroupId(state ,{ groupId }){  
            state.currGroupId = groupId  
        }
    },
    actions: {
        async addBoard({commit}){
            const newBoard = taskService.getEmptyBoard()
            taskService.addBoard(newBoard)
            commit({type:'addBoard', newBoard})
        },
        async addTask({ commit, state }, { task, group, boardId}) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                if (task.id) {
                    var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
                    await taskService.add(task, groupIdx, taskIdx, boardIdx)
                }
                else {
                    await taskService.add(task, groupIdx, -1, boardIdx)
                }
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async updateGroup({state, commit}, {group, boardId}){
            try{
                console.log('state.boards at store 85', state.boards)
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                console.log('boardIdx at store', boardIdx)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                await taskService.updateGroup(group, boardIdx, groupIdx)
                const boards = await taskService.query();
                commit ({type: 'updateBoard', boardIdx, board: boards[boardIdx]})
            }
            catch (err) {
                console.log('taskStore: Error in updateGroup', err)
                throw err
            }
        },
        async loadBoard({ commit, state }, {boardId}) {
            try {
                await this.dispatch({ type: "loadBoards" })
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                commit({ type: 'setBoard', board: state.boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in loadBoard', err)
                throw err
            }
        },
        async updateBoard({commit}, {boardToUpdate}){
            try{
                console.log('boardToUpdate at store 112', boardToUpdate)
                var boardIdx = state.boards.findIndex(b => b._id === boardToUpdate._id)
                await taskService.saveBoard(boardToUpdate, boardIdx)
                const boards = await taskService.query();
                commit({ type: 'updateBoard', board: boards[boardIdx] })
            }
            catch (err) {
                console.log('taskStore: Error in updateBoard', err)
                throw err
            }
        },
        async loadBoards({ commit }) {
            try {
                const boards = await taskService.query();
                console.log('boards at store 122', boards)
                commit({ type: 'setBoards', boards })
            } catch (err) {
                console.log('taskStore: Error in loadBoards', err)
                throw err
            }
        },
        async removeTask({ commit, state}, { task }) {
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
               const boards= await taskService.remove(boardIdx, groupIdx, taskIdx);
               const currBoard = boards[boardIdx]
                commit({ type: 'setBoard', board:currBoard })
            } catch (err) {
                console.log('taskStore: Error in removeTask', err)
                throw err
            }
        },
        getById({ state, commit }, { id }) {
            var task = taskService.getById(state.board, id)
            commit({ type: "getTaskActivities", taskId: task.id })
            return task
        },
        async addCheckList({commit, state} ,{checkList, task} ){
            
            checkList.id = utilService.makeId()
            checkList.todos.forEach(todo => {
                todo.id = utilService.makeId()
            });
            if(!task.checklists || !task.checklists.length) task.checklists = [checkList]
            else task.checklists.push(checkList)
            
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
        
            try{
                await taskService.add(task, groupIdx, taskIdx)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err){
                console.log('Cannot save checklist', err)
            }
        },
        async saveComment({ commit, state }, {task, comment}){
            
            if(!comment.id){
                comment.id = utilService.makeId();
                comment.createdAt = Date.now()
                if(!task.comments || !task.comments.length) task.comments = [comment]
                else task.comments.push(comment)
            }
            else {
                const commentIdx = task.comments.findIndex(c => c.id === comment.id)
                task.comments.splice(commentIdx, 1, comment)
            }
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
           
            try{
                await taskService.add(task, groupIdx, taskIdx, boardIdx)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err){
                console.log('Cannot save comment', err)
            }

        },
        updatePlaces({ state, commit }, { group }){
            
        }
    }
}