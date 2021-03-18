import { taskService } from '../services/task.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const taskStore = {
    state: {
        tasks: [],
        board: null,
        boards: null,
        currTaskActivities:null,
        
    },
    getters: {
        tasks(state) {
            return state.tasks;
        },
        getBoard(state) {
            return state.board
        },
        getBoards(state) {
            console.log('state.boards', state.boards)
            return state.boards
        },
        taskActivities(state){
            return state.currTaskActivities
        }
    },
    mutations: {
        setBoard(state, { board }) {
            state.board = board;
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id !== taskId)
        },
        getTaskActivities(state, { taskId }) {
            console.log(taskId)
            var activities = state.board.activities.find(activity =>{
                if(activity.task.id === taskId) return activity
            })
        //    console.log('board',activities)
        //    console.log('mutaed',state.board.activities)
        console.log(activities)
            state.currTaskActivities = [activities]
        }
    },
    actions: {
        async addTask({ commit, state }, { task, group, boardId }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                if (task.id) {
                    var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
                    await taskService.add(task, groupIdx, taskIdx)
                }
                else {
                    await taskService.add(task, groupIdx, -1)
                }
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async loadBoard({ commit, state }, {boardId}) {
            try {
                await this.dispatch({ type: "loadBoards" })
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in loadBoard', err)
                throw err
            }
        },
        async loadBoards({ commit }) {
            try {
                const boards = await taskService.query();
                console.log('boards from storage', boards)
                commit({ type: 'setBoards', boards })
            } catch (err) {
                console.log('taskStore: Error in loadBoards', err)
                throw err
            }
        },
        async removeTask({ commit }, { taskId }) {
            try {
                await taskService.remove(taskId);
                commit({ type: 'removeTask', taskId })
            } catch (err) {
                console.log('taskStore: Error in removeTask', err)
                throw err
            }
        },
        getById({ state, commit }, { id }) {
            var task = taskService.getById(state.board, id)
            console.log('task in store:', task)
            commit({ type: "getTaskActivities", taskId: task.id })
            return task
        },
        updatePlaces({ state, commit }, { group }){
            
        }
    }
}