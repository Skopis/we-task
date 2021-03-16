import { cardService } from '../services/card.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const cardStore = {
    state: {
        cards: [],
        board: cardService.query()
    },
    getters: {
        cards(state) {
            return state.cards;
        },
        getBoard(state){
            console.log('state.board', state.board)
            return state.board
        }
    },
    mutations: {
        setCards(state, { cards }) {
            state.cards = cards;
        },
        addCard(state, { card }) {
            state.cards.push(card)
        },
        removeCard(state, { cardId }) {
            state.cards = state.cards.filter(card => card._id !== cardId)
        },
    },
    actions: {
        async addCard(context, { card }) {
            try {
                card = await cardService.add(card)
                context.commit({ type: 'addCard', card })
                return card;
            } catch (err) {
                console.log('cardStore: Error in addCard', err)
                throw err
            }
        },
        async loadCards(context) {
            try {
                const cards = await cardService.query();
                context.commit({ type: 'setCards', cards })
                socketService.off(SOCKET_EVENT_CARD_ADDED)
                socketService.on(SOCKET_EVENT_CARD_ADDED, card => {
                    context.commit({ type: 'addCard', card })
                })

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