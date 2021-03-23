import {socketService} from '../services/socket.service.js'

export const socketStore = {
    state: {
    },
    getters: {
    },
    mutations: {
        setJob(state, {job}) {
            state.job = job;
        }
    },
    actions: {
        // TODO: show on
        sendBoard(context, {board}) {
            socketService.emit('sendBoard', board)
        },
        getChatHistory(context, {chatId}) {
            socketService.emit('getHistory', chatId)
        }
    }
}