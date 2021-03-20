import { taskService } from '../services/task.service'
import { utilService } from '../services/util.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const taskStore = {
    state: {
        archive: [],
        tasks: [],
        board: null,
        boards: null,
        currTaskActivities: null,
        currGroupId: null,
        currTask: null,
    },
    getters: {
        tasks(state) {
            return state.tasks;
        },
        getBoard(state) {
            return state.board
        },
        getBoardId(state) {
            return state.board._id
        },
        getBoards(state) {
            return state.boards
        },
        taskActivities(state) {
            return state.currTaskActivities
        },
        getArchive(state) {
            return state.archive
        }
    },
    mutations: {
        addBoard(state, { newBoard }) {
            state.boards.push(newBoard)
            state.board = newBoard
        },
        addGroup(state, { newGroup }) {
            state.board.groups.push(newGroup)
        },
        updateBoard(state, { boardIdx, board }) {
            console.log('boardIdx at 36', boardIdx)
            console.log('board at 37', board)//was undefined
            state.boards.splice(boardIdx, 1, board)
            state.board = board
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
            var activities = state.board.activities.find(activity => {
                if (activity.task.id === taskId) return activity
            })
            state.currTaskActivities = [activities]
        },
        saveCurrGroupId(state, { groupId }) {
            state.currGroupId = groupId
        },
        archiveGroup(state, { group }) {
            state.archive.push(group)
            console.log('state.archive', state.archive)
        },
        setArchive(state, { archive }) {
            state.archive = archive
        },
        archiveBoard(state, { board }) {
            console.log('board at store 75', board)
            state.archive.push(board)
        }
    },
    actions: {
        async archiveBoard({ state, commit }, { board }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === board._id)
                await taskService.archiveBoard(board, boardIdx)
                const boards = await taskService.query();

                commit({ type: 'archiveBoard', board })
                commit({ type: 'setBoards', boards })
            }
            catch (err) {
                console.log('taskStore: Error in archiveBoard', err)
                throw err
            }
        },
        async archiveGroup({ state, commit }, { group, boardId }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                await taskService.archiveGroup(group, groupIdx, boardIdx)
                const boards = await taskService.query();
                commit({ type: 'archiveGroup', group })
                commit({ type: 'setBoard', board: boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in archiveGroup', err)
                throw err
            }
        },
        async addGroup({ state, commit }, { boardId }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                const newGroup = taskService.getEmptyGroup()
                await taskService.addGroup(newGroup, boardIdx)
                commit({ type: 'addGroup', newGroup })
            } catch (err) {
                console.log('taskStore: Error in addGroup', err)
                throw err
            }
        },
        async addBoard({ commit }) {
            try {
                const newBoard = taskService.getEmptyBoard()
                await taskService.addBoard(newBoard)
                commit({ type: 'addBoard', newBoard })
            } catch (err) {
                console.log('taskStore: Error in addBoard', err)
                throw err
            }
        },
        async addTask({ commit, state }, { task, group, boardId }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
                if (state.currGroupId) var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
                else groupIdx = state.board.groups.findIndex(g => g.id === group.id)
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
        // async updateGroup({ state, commit }, { group, boardId }) {
        //     try {
        // async addTask({ commit, state }, { task, group, boardId}) {
        //     try {
        //         var boardIdx = state.boards.findIndex(b => b._id === boardId)
        //         if(state.currGroupId) var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
        //         else groupIdx = state.board.groups.findIndex(g => g.id === group.id)
        //         if (task.id) {
        //             var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
        //             await taskService.add(task, groupIdx, taskIdx, boardIdx)
        //         }
        //         else {
        //             await taskService.add(task, groupIdx, -1, boardIdx)
        //         }
        //         const boards = await taskService.query();
        //         commit({ type: 'setBoard', board: boards[boardIdx] })
        //     } catch (err) {
        //         console.log('taskStore: Error in addTask', err)
        //         throw err
        //     }
        // },
        async updateGroup({ state, commit }, { group, boardId }) {
            try {
                console.log('state.boards at store 85', state.boards)
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                console.log('boardIdx at store', boardIdx)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                await taskService.updateGroup(group, boardIdx, groupIdx)
                const boards = await taskService.query();
                commit({ type: 'updateBoard', boardIdx, board: boards[boardIdx] })
            }
            catch (err) {
                console.log('taskStore: Error in updateGroup', err)
                throw err
            }
        },
        async loadArchive({ commit }) {
            try {
                const archive = await taskService.loadArchive()
                commit({ type: 'setArchive', archive })
            } catch (err) {
                console.log('taskStore: Error in loadArchive', err)
                throw err
            }
        },
        async loadBoard({ commit, state }, { boardId }) {
            try {
                await this.dispatch({ type: "loadBoards" })
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                commit({ type: 'setBoard', board: state.boards[boardIdx] })
            } catch (err) {
                console.log('taskStore: Error in loadBoard', err)
                throw err
            }
        },
        async updateBoard({ state, commit }, { boardToUpdate }) {
            try {
                console.log('boardToUpdate at store 112', boardToUpdate)
                var boardIdx = state.boards.findIndex(b => b._id === boardToUpdate._id)
                await taskService.saveBoard(boardToUpdate, boardIdx)
                commit({ type: 'updateBoard', boardIdx, board: boardToUpdate })
                // const boards = await taskService.query();
                // commit({ type: 'updateBoard', boardIdx, board: boards[boardIdx] })
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
        async removeTask({ commit, state }, { task }) {
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                const boards = await taskService.remove(boardIdx, groupIdx, taskIdx);
                const currBoard = boards[boardIdx]
                commit({ type: 'setBoard', board: currBoard })
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
        async addCheckList({ commit, state }, { checkList, task }) {
            checkList.id = utilService.makeId()
            checkList.todos.forEach(todo => {
                todo.id = utilService.makeId()
            });
            if (!task.checklists || !task.checklists.length) task.checklists = [checkList]
            else task.checklists.push(checkList)

            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                await taskService.add(task, groupIdx, taskIdx)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err) {
                console.log('Cannot save checklist', err)
            }
        },
        async saveComment({ commit, state }, { task, comment }) {

            if (!comment.id) {
                comment.id = utilService.makeId();
                comment.createdAt = Date.now()
                if (!task.comments || !task.comments.length) task.comments = [comment]
                else task.comments.push(comment)
            }
            else {
                const commentIdx = task.comments.findIndex(c => c.id === comment.id)
                task.comments.splice(commentIdx, 1, comment)
            }
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))

            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                await taskService.add(task, groupIdx, taskIdx, boardIdx)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        updatecurrGroupIdSession({ commit }, { status, groupId }) {
            const currGroupId = taskService.handleGroupInSession(status, groupId)
            commit({ type: 'saveCurrGroupId', groupId: currGroupId })
        },
        async setTaskLabel({ commit, state }, { task,label }){
            label.id = utilService.makeId()
            if(!task.labels || !task.labels.length){
                task.labels = [label]
            }else{
                task.labels.push(label)
            }
            console.log('labels:', task.labels)
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                await taskService.add(task, groupIdx, taskIdx, boardIdx)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err) {
                console.log('Cannot save comment', err)
            }
        }
    }
}