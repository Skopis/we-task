import { cardService } from '../services/card.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const cardStore = {
    state: {
        cards: [],
        board: null
    },
    getters: {
        cards(state) {
            return state.cards;
        },
        getBoard(state){
            return state.board
        }
    },
    mutations: {
        setBoard(state, { board }) {
            state.board = board;
        },
        addCard(state, { card }) {
            state.board.lists[0].cards.push(card)
        },
        removeCard(state, { cardId }) {
            state.cards = state.cards.filter(card => card._id !== cardId)
        },
    },
    actions: {
        async addCard(context, { card }) {
            try {
                console.log('card at store at 31', card)
                card = await cardService.add(card)
                console.log('card at store at 33', card)
                context.commit({ type: 'addCard', card })
                return card;
            } catch (err) {
                console.log('cardStore: Error in addCard', err)
                throw err
            }
        },
        async loadBoard(context) {
            try {
                const board = await cardService.query();
                context.commit({ type: 'setBoard', board })
            } catch (err) {
                console.log('cardStore: Error in loadCards', err)
                throw err
            }
        },
        async removeCard(context, { cardId }) {
            try {
                await cardService.remove(cardId);
                context.commit({ type: 'removeCard', cardId })
            } catch (err) {
                console.log('cardStore: Error in removeCard', err)
                throw err
            }
        },
    }
}