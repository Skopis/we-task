import { boardService } from '../services/board.service'
import { utilService } from '../services/util.service'
import { socketService, SOCKET_EVENT_CARD_ADDED } from '../services/socket.service'

export const boardStore = {
    state: {
        archive: [],
        tasks: [],
        board: null,
        boards: null,
        currTaskActivities: null,
        currGroupId: null,
        currTask: null,
        filterBy: '',
        groupTitle: ''
    },
    getters: {
        groupsNameNAmount(state) {
            const nameAmount = [];
            state.board.groups.forEach(group => {
                nameAmount.push({ groupName: group.title, amount: group.tasks.length })
            })
            return nameAmount;
        },
        tasksPerPerson(state) {
            var allTasks = 0;
            const persons = state.board.members.map(member => {
                return ({ fullname: member.fullname, tasks: 0 });
            })
            state.board.groups.forEach(group => {
                group.tasks.forEach(task => {
                    allTasks++;
                    if (task.members) {
                        task.members.forEach(member => {
                            const idx = persons.findIndex((person) => {
                                return member.fullname == person.fullname;
                            })
                            if (idx !== -1) {
                                persons[idx].tasks++;
                            }else{
                                persons.push({ fullname: member.fullname, tasks: 0 })
                            }
                        })
                    }
                })
            })
            return { allTasks, persons }
        },
        groupTitle(state) {
            return state.groupTitle
        },
        boardMembers(state) {
            return state.board.members
        },
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
        },
        setLabelText(state, { labelIdx, newTxt }) {
            state.board.labels[labelIdx].title = newTxt;
        },
        getGroupByTaskId(state, taskId) {
            var groupTitle
            for (let i = 0; i < state.board.groups.length; i++) {
                state.board.groups[i].tasks.forEach(task => {
                    if (task.id === taskId) {
                        groupTitle = state.board.groups[i].title
                    }
                })
            }
            state.groupTitle = groupTitle
        }
    },
    actions: {
        updateLabel({ state, commit }, { labelData }) {
            const newTxt = labelData.txt;
            const labelIdx = state.board.labels.findIndex(label => label.id === labelData.labelId)
            commit({ type: 'setLabelText', labelIdx, newTxt })
            const boardToUpdate = state.board
            this.dispatch({ type: 'updateBoard', boardToUpdate })
        },
        async updateBoard({ state, commit }, { boardToUpdate }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                var boardIdx = state.boards.findIndex(b => b._id === boardToUpdate._id)
                commit({ type: 'updateBoard', boardIdx, board: boardToUpdate })
                await this.dispatch({ type: 'sendUpdatedBoard' });
                await boardService.saveBoard(boardToUpdate, boardIdx)
            }
            catch (err) {
                console.log('boardStore: Error in updateBoard', err)
                throw err
            }
        },
        sendUpdatedBoard({ state }) {
            if (state.filterBy === '') {
                socketService.emit("board change", state.board);
            }
        },
        async addTask({ state, commit }, { task, group }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                if (!group) {
                    const currGroupId = await boardService.getGroupId()
                    var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))
                }
                else groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const { boardToUpdate, taskForUpdate } = await boardService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
                return taskForUpdate
            } catch (err) {
                console.log('boardStore: Error in addTask', err)
                throw err
            }
        },
        async archiveBoard({ state, commit }, { board }) {
            try {
                var boardIdx = state.boards.findIndex(b => b._id === board._id)
                await boardService.archiveBoard(board, boardIdx)
                commit({ type: 'archiveBoard', board, boardIdx })
            }
            catch (err) {
                console.log('boardStore: Error in archiveBoard', err)
                throw err
            }
        },
        async archiveGroup({ state, commit }, { group }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardToUpdate = await boardService.archiveGroup(group, groupIdx, state.board)
                commit({ type: 'archiveGroup', group })
                this.dispatch({ type: 'updateBoard', boardToUpdate })
            } catch (err) {
                console.log('boardStore: Error in archiveGroup', err)
                throw err
            }
        },
        async addGroup({ state, commit }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                const newGroup = boardService.getEmptyGroup()
                await boardService.addGroup(newGroup, state.board)
                commit({ type: 'addGroup', newGroup })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('boardStore: Error in addGroup', err)
                throw err
            }
        },
        async addBoard({ commit }) {
            try {
                const newBoard = await boardService.addBoard()//newBoard
                console.log('newBoard', newBoard)
                commit({ type: 'addBoard', newBoard })
            } catch (err) {
                console.log('boardStore: Error in addBoard', err)
                throw err
            }
        },
        async updateGroup({ state }, { group }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                var groupIdx = state.board.groups.findIndex(g => g.id === group.id)
                const boardForUpdate = await boardService.updateGroup(group, state.board, groupIdx)
                await this.dispatch({ type: 'updateBoard', boardToUpdate: boardForUpdate })
            }
            catch (err) {
                console.log('boardStore: Error in updateGroup', err)
                throw err
            }
        },
        async loadArchive({ commit }) {
            try {
                const archive = await boardService.loadArchive()
                commit({ type: 'setArchive', archive })
            } catch (err) {
                console.log('boardStore: Error in loadArchive', err)
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
                console.log('boardStore: Error in loadBoard', err)
                throw err
            }
        },
        async loadBoards({ commit }) {
            try {
                const boards = await boardService.query();
                commit({ type: 'setBoards', boards })
            } catch (err) {
                console.log('boardStore: Error in loadBoards', err)
                throw err
            }
        },
        async removeTask({ commit, state }, { task }) {
            if (state.filterBy !== '') {
                return
            }
            var boardIdx = state.boards.findIndex(b => b._id === state.board._id)
            const currGroupId = await boardService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))
            var taskIdx = state.board.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
            try {
                const boards = await boardService.remove(state.board, groupIdx, taskIdx);
                const currBoard = boards[boardIdx]
                commit({ type: 'setBoard', board: currBoard })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('boardStore: Error in removeTask', err)
                throw err
            }
        },
        getById({ state, commit }, { id }) {
            var task = boardService.getById(state.board, id)
            commit({ type: "getTaskActivities", taskId: task.id })
            return task
        },
        async addCheckList({ state, commit }, { checkList, task }) {
            console.log('checkList at store', checkList)
            if (state.filterBy !== '') {
                return
            }
            checkList.id = utilService.makeId()
            checkList.todos.forEach(todo => {
                todo.id = utilService.makeId()
            });
            if (!task.checklists || !task.checklists.length) task.checklists = [checkList]
            else task.checklists.push(checkList)
            const currGroupId = await boardService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(currGroupId))
            try {
                const { boardToUpdate } = await boardService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
            } catch (err) {
                console.log('Cannot save checklist', err)
            }
        },
        async saveComment({ commit, state }, { task, comment }) {
            if (state.filterBy !== '') {
                return
            }
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
            const groupId = await boardService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            try {
                const { boardToUpdate } = await boardService.add(task, groupIdx, state.board)
                await this.dispatch({ type: 'updateBoard', boardToUpdate })
            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        updateCurrGroupIdSession({ commit }, { status, groupId }) {
            const currGroupId = boardService.handleGroupInSession(status, groupId)
            commit({ type: 'saveCurrGroupId', groupId: currGroupId })
        },
        async setTaskLabel({ commit, state }, { task, label }) {
            var isAdded = false
            if (state.filterBy !== '') {
                return
            }
            if (!task.labels || !task.labels.length) {
                task.labels = [label]
                isAdded = true
            } else {
                var labelIdx = task.labels.findIndex(l => l.id === label.id)
                if (labelIdx === -1) {
                    isAdded = true
                    task.labels.push(label);
                } else {
                    task.labels.splice(labelIdx, 1);
                }
            }
            const groupId = await boardService.getGroupId()
            var groupIdx = state.board.groups.findIndex(g => g.id === JSON.parse(groupId))
            try {
                const { boardToUpdate } = await boardService.add(task, groupIdx, state.board)
                commit({ type: 'setBoard', board: boardToUpdate })
                this.dispatch({ type: 'sendUpdatedBoard' });
                return isAdded
            } catch (err) {
                console.log('Cannot save comment', err)
            }
        },
        async addActivity({ state, commit }, { activity }) {
            if (state.filterBy !== '') {
                return
            }
            try {
                const { activityToAdd, boardToUpdate } = await boardService.addActivity(activity, state.board)
                commit({ type: 'addActivity', activityToAdd })
                this.dispatch({ type: 'updateBoard', boardToUpdate })
            }
            catch (err) {
                console.log('Cannot addActivity', err)
            }
        }
    }
}