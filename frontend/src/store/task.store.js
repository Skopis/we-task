import { taskService } from '../services/task.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const taskStore = {
    state: {
        tasks: [],
        board: null
    },
    getters: {
        tasks(state) {
            return state.tasks;
        },
        getBoard(state) {
            return state.board
        }
    },
    mutations: {
        setBoard(state, { board }) {
            state.board = board;
        },
        addTask(state, { task, groupIdx }) {
            state.board.groups[groupIdx].tasks.unshift(task)
        },
        updateTask(state, { task, groupIdx, taskIdx }) {
            state.board.groups[groupIdx].tasks.splice(taskIdx, 1, task)
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id !== taskId)
        },
    },
    actions: {
        async addTask({ commit, state }, { task, group }) {
            try {
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                if (task.id) {
                    var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
                    commit({ type: 'updateTask', task, groupIdx, taskIdx })
                }
                else {
                    commit({ type: 'addTask', task, groupIdx })
                    taskIdx = -1
                }
                var taskToCommit = await taskService.add(task, groupIdx, taskIdx)
                return taskToCommit;
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async loadBoard({ commit }) {
            try {
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[0] })
            } catch (err) {
                console.log('taskStore: Error in loadTasks', err)
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
        getById({ state }, { id }) {
            var task = taskService.getById(state.board, id)
            console.log('store task', task)
            return task
        }
    }
}