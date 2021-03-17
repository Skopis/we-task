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
        addTask(state, { task }) {
            state.board.groups[0].tasks.push(task)
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id !== taskId)
        },
    },
    actions: {
        async addTask(context, { task }) {
            try {
                console.log('task at store at 31', task)
                task = await taskService.add(task)
                console.log('task at store at 33', task)
                context.commit({ type: 'addTask', task })
                return task;
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async loadBoard(context) {
            try {
                const board = await taskService.query();
                context.commit({ type: 'setBoard', board })
            } catch (err) {
                console.log('taskStore: Error in loadTasks', err)
                throw err
            }
        },
        async removeTask(context, { taskId }) {
            try {
                await taskService.remove(taskId);
                context.commit({ type: 'removeTask', taskId })
            } catch (err) {
                console.log('taskStore: Error in removeTask', err)
                throw err
            }
        },
        getById({ state }, { id }) {
            
            var task = taskService.getById(state.board, id)
            console.log('store task',task)
            return task
        }
    }
}