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
        sendBoard(context, {board}) {
            console.log('socket is sending');
            socketService.emit('sendBoard', board)
        },
        getChatHistory(context, {chatId}) {
            socketService.emit('getHistory', chatId)
        }
    }
}