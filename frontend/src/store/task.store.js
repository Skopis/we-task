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
        filterBy: '',
    },
    getters: {
        tasks(state) {
            return state.tasks;
        },
        getBoard(state) {
            const fillteredBoard = JSON.parse(
                JSON.stringify(state.board)
            );
            if (fillteredBoard) {
                fillteredBoard.groups.forEach((group, gIdx) => {
                    for (let tIdx = 0; tIdx < group.tasks.length; tIdx++) {
                        if (
                            !group.tasks[tIdx].title
                                .toLowerCase()
                                .includes(state.filterBy.toLowerCase())
                        ) {
                            fillteredBoard.groups[gIdx].tasks.splice(tIdx, 1);
                            tIdx = tIdx - 1;
                        }
                    }
                });
            }
            return fillteredBoard;
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
        },
        getBoardLabels(state) {
            return state.board.labels
        }
    },
    mutations: {
        setFilterBy(state, { filterBy }) {
            state.filterBy = filterBy;
        },
        addBoard(state, { newBoard }) {
            state.boards.push(newBoard)
            state.board = newBoard
        },
        addGroup(state, { newGroup }) {
            state.board.groups.push(newGroup)
        },
        updateBoard(state, { boardIdx, board }) {
            state.boards.splice(boardIdx, 1, board)
            state.board = board
        },
        setBoard(state, { board }) {
            state.board = board;
        },
        setBoards(state, { boards }) {
            state.boards = boards;
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id === taskId)
        },
        getTaskActivities(state, { taskId }) {
            var activities = state.board.activities.filter(a => a.task.id === taskId)
            state.currTaskActivities = activities
        },
        saveCurrGroupId(state, { groupId }) {
            state.currGroupId = groupId
        },
        archiveGroup(state, { group }) {
            state.archive.push(group)
        },
        setArchive(state, { archive }) {
            state.archive = archive
        },
        archiveBoard(state, { board, boardIdx }) {
            state.archive.push(board)
            state.boards.splice(boardIdx, 1)
        },
        addActivity(state, { activityToAdd }) {
            state.board.activities.push(activityToAdd)
        }
    },
    actions: {
        async updateBoard({ state, commit }, { boardToUpdate }) {
            if (state.filterBy !== ''){
                return
            }
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardToUpdate._id)
                await taskService.saveBoard(boardToUpdate, boardIdx)
                commit({ type: 'updateBoard', boardIdx, board: boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
            }
            catch (err) {
                console.log('taskStore: Error in updateBoard', err)
                throw err
            }
        },
        sendUpdatedBoard({ state }) {
            // console.log("Sending", state.board);
            if (state.filterBy === '') {
                socketService.emit("board change", state.board);
            }
        },
        async addTask({ commit, state }, { task, group }) {
            try {
                if (!group) {
                    const currGroupId = await taskService.getGroupId()
                    var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))
                }
                else groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardForUpdate = await taskService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: boardForUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async archiveBoard({ state, commit }, { board }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === board._id)
                await taskService.archiveBoard(board, boardIdx)
                commit({ type: 'archiveBoard', board, boardIdx })
            }
            catch (err) {
                console.log('taskStore: Error in archiveBoard', err)
                throw err
            }
        },
        async archiveGroup({ state, commit }, { group }) {
            try {
                // var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardToUpdate = await taskService.archiveGroup(group, groupIdx, state.board)
                // const boards = await taskService.query();
                commit({ type: 'archiveGroup', group })
                commit({ type: 'setBoard', board: boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('taskStore: Error in archiveGroup', err)
                throw err
            }
        },
        async addGroup({ state, commit }) {
            try {
                const newGroup = taskService.getEmptyGroup()
                await taskService.addGroup(newGroup, state.board)
                commit({ type: 'addGroup', newGroup })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('taskStore: Error in addGroup', err)
                throw err
            }
        },
        async addBoard({ commit }) {
            try {
                const newBoard = await taskService.addBoard()//newBoard)
                commit({ type: 'addBoard', newBoard })
            } catch (err) {
                console.log('taskStore: Error in addBoard', err)
                throw err
            }
        },
        async updateGroup({ state, commit }, { group, boardId }) {
            try {
                // var boardIdx = state.boards.findIndex(b => b._id === boardId)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardForUpdate = await taskService.updateGroup(group, state.board, groupIdx)
                // commit({ type: 'updateBoard', boardIdx, board: boardForUpdate })
                await this.dispatch({ type: 'updateBoard', boardToUpdate: boardForUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
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
                if (boardId) {
                    var boardIdx = state.boards.findIndex(b => b._id === boardId)
                    commit({ type: 'setBoard', board: state.boards[boardIdx] })
                }
                else commit({ type: 'setBoard', board: state.boards[0] })
            } catch (err) {
                console.log('taskStore: Error in loadBoard', err)
                throw err
            }
        },
        async loadBoards({ commit }) {
            try {
                const boards = await taskService.query();
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
                const boards = await taskService.remove(state.board, groupIdx, taskIdx);
                const currBoard = boards[boardIdx]
                commit({ type: 'setBoard', board: currBoard })
                this.dispatch({ type: 'sendUpdatedBoard' });
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
            const currGroupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))

            try {
                const updatedBoard = await taskService.add(task, groupIdx, state.board)
                this.dispatch({ type: 'updateBoard', boardToUpdate: updatedBoard })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('Cannot save checklist', err)
            }
        },
        async saveComment({ commit, state }, { task, comment }) {
            if (!comment.id) {
                comment.id = utilService.makeId();
                comment.createdAt = Date.now()
                const { fullname, _id, imgUrl } = this.getters.loggedinUser
                comment.byMember = { fullname, _id, imgUrl }
                if (!task.comments || !task.comments.length) task.comments = [comment]
                else task.comments.push(comment)
            }
            else {
                const commentIdx = task.comments.findIndex(c => c.id === comment.id)
                task.comments.splice(commentIdx, 1, comment)
            }
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            try {
                const updatedBoard = await taskService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: updatedBoard })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        updateCurrGroupIdSession({ commit }, { status, groupId }) {
            const currGroupId = taskService.handleGroupInSession(status, groupId)
            commit({ type: 'saveCurrGroupId', groupId: currGroupId })
        },
        async setTaskLabel({ commit, state }, { task, label }) {
            if (!task.labels || !task.labels.length) {
                task.labels = [label]
            } else {
                if (task.labels.find(l => l.id === label.id)) return
                else task.labels.push(label)
            }
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            try {
                const updatedBoard = await taskService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: updatedBoard })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        async addActivity({ state, commit }, { activity }) {
            try {
                // console.log('state.board.activities', state.board.activities)
                const { activityToAdd, boardToUpdate } = await taskService.addActivity(activity, state.board)
                commit({ type: 'addActivity', activityToAdd })
                this.dispatch({ type: 'updateBoard', boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
            }
            catch (err) {
                console.log('Cannot addActivity', err)
            }
        }
    }
}