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
        },
        getBoardLabels(state){
            return state.board.labels
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
            console.log('task id after remove from storage:', taskId)
        },
        getTaskActivities(state, { taskId }) {
            var activities = state.board.activities.filter(a => a.task.id === taskId)
            state.currTaskActivities = activities
        },
        saveCurrGroupId(state, { groupId }) {
            state.currGroupId = groupId
            console.log('groupId', groupId)
            console.log('state.currGroupId', state.currGroupId)
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
        addActivity(state, {activityToAdd}){
            console.log('activity at store commit', activityToAdd)
            console.log('state.board before', state.board)
            state.board.activities.push(activityToAdd)
            console.log('state.board after', state.board)
        }
    },
    actions: {
        async archiveBoard({ state, commit }, { board }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === board._id)
                await taskService.archiveBoard(board, boardIdx)
                // const boards = await taskService.query();
                commit({ type: 'archiveBoard', board, boardIdx })
                // commit({ type: 'setBoards', boards })
            }
            catch (err) {
                console.log('taskStore: Error in archiveBoard', err)
                throw err
            }
        },
        async archiveGroup({ state, commit }, { group}) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                await taskService.archiveGroup(group, groupIdx, state.board)
                const boards = await taskService.query();
                commit({ type: 'archiveGroup', group })
                commit({ type: 'setBoard', board: boards[boardIdx] })
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
        async addTask({ commit, state }, { task, group }) {
            try {
                if(!group) {
                    const currGroupId = await taskService.getGroupId()
                    var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))
                }
                else groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardForUpdate = await taskService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: boardForUpdate })
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async updateGroup({ state, commit }, { group, boardId }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardId)
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardForUpdate = await taskService.updateGroup(group, state.board, groupIdx)
                commit({ type: 'updateBoard', boardIdx, board: boardForUpdate })
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
                var boardIdx = state.boards.findIndex(b => b._id === boardToUpdate._id)
                await taskService.saveBoard(boardToUpdate, boardIdx)
                commit({ type: 'updateBoard', boardIdx, board: boardToUpdate })
            }
            catch (err) {
                console.log('taskStore: Error in updateBoard', err)
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
            var board = state.boards.find(b => b._id === state.board._id)
            var groupIdx = state.board.groups.findIndex(g => g.id === state.currGroupId)
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                await taskService.add(task, groupIdx, taskIdx,board)
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
                const {fullname, _id, imgUrl} = this.getters.loggedinUser
                comment.byMember = {fullname, _id, imgUrl}
                if (!task.comments || !task.comments.length) task.comments = [comment]
                else task.comments.push(comment)
            }
            else {
                const commentIdx = task.comments.findIndex(c => c.id === comment.id)
                task.comments.splice(commentIdx, 1, comment)
            }
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var board = state.boards.find(b => b._id === state.board._id)
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            // var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)

            try {
                await taskService.add(task, groupIdx, board)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        updateCurrGroupIdSession({ commit }, { status, groupId }) {
            const currGroupId = taskService.handleGroupInSession(status, groupId)
            commit({ type: 'saveCurrGroupId', groupId: currGroupId })
        },
        async setTaskLabel({ commit, state }, { task, label}){
            // const label = state.board.labels.find(label => label.id === labelId)
            if(!task.labels || !task.labels.length){
                task.labels = [label]
            }else{
                if(task.labels.find(l=> l.id === label.id)) return
                else task.labels.push(label)
            }
            // console.log('labels:', task.labels, task.id)
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            var board = state.boards.find(b => b._id === state.board._id)
            const groupId = await taskService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
            // console.log(taskIdx)

            try {
                await taskService.add(task, groupIdx, taskIdx, board)
                const boards = await taskService.query();
                commit({ type: 'setBoard', board: boards[boardIdx] })

            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        async addActivity({state, commit }, {activity}){
            try{
                console.log('state.board.activities', state.board.activities)
                const {activityToAdd, boardToUpdate} = await taskService.addActivity(activity, state.board)
                commit({type: 'addActivity', activityToAdd})
                this.dispatch({type: 'updateBoard', boardToUpdate})
            }
            catch (err) {
                console.log('Cannot addActivity', err)
            }
        }
    }
}