import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'

export const boardService = {
  add,
  query,
  remove,
  getById,
  getUser,
  addBoard,
  addGroup,
  saveBoard,
  getGroupId,
  addActivity,
  updateGroup,
  loadArchive,
  archiveGroup,
  archiveBoard,
  getEmptyGroup,
  handleGroupInSession
}

function getUser() { // TODO: is this really usefull?
  return {
    "_id": "u111",
    "fullname": "Guest",
    "imgUrl": "",
  }
}

async function addActivity(activity, board) {
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  var activityToAdd = JSON.parse(JSON.stringify(activity))
  activityToAdd.id = utilService.makeId()
  boardToUpdate.activities.push(activityToAdd)
  await httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
  return { activityToAdd, boardToUpdate }
}

function handleGroupInSession(status, groupId) { // saves groupId to session
  var currGroup = groupId
  if (status === 'saveToSession') {
    storageService.saveToSessionStorage('groupId', groupId)
    return currGroup
  }
  else if (status === 'removeFromSession') {
    currGroup = storageService.removeSessionStorage('groupId')
    return currGroup = null
  }
}

async function getGroupId() { // get groupId from session
  const groupId = storageService.getFromSessionStorage('groupId')
  return groupId
}

async function loadArchive() {
  const archive = await storageService.query('archive')
  return archive
}

async function archiveBoard(board, boardIdx) { // remove board
  httpService.delete(`board/${board._id}`);

  var archive = await storageService.query('archive')
  if (archive) archive.push(board)
  else archive = [boardIdx]
  storageService._save('archive', archive)
}

async function archiveGroup(group, groupIdx, board) { //delete group and update
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.splice(groupIdx, 1);
  httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);

  var archive = await storageService.query('archive')
  if (archive) archive.push(group)
  else archive = [group]
  storageService._save('archive', archive)

  return boardToUpdate
}

async function addGroup(newGroup, board) { // add group and update board
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.push(newGroup);
  httpService.put(`board/${board._id}`, boardToUpdate);
}

async function updateGroup(group, board, groupIdx) { // update group and update board
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.splice(groupIdx, 1, group)
  httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
  return boardToUpdate
}

async function remove(board, groupIdx, taskIdx) { // remove task
  try {
    const boardToUpdate = JSON.parse(JSON.stringify(board))
    boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1)
    await httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
    return query();
  } catch (err) {
    console.log('Cannot get boards', err)
  }
}

async function add(task, groupIdx, board) { // add task
  var taskForUpdate = JSON.parse(JSON.stringify(task))
  // console.log('service', task)
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  // console.log('service checklist add board:', boardToUpdate)
  if (task.id) {
    
    var taskIdx = boardToUpdate.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
    // console.log('taskIdx',taskIdx)
    // console.log('groupIdx',groupIdx)
    boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1, taskForUpdate)
  }
  else {
    taskForUpdate.id = utilService.makeId()
    boardToUpdate.groups[groupIdx].tasks.push(taskForUpdate);
  }
  await httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
  return {boardToUpdate, taskForUpdate};
}

function getEmptyGroup() { // create a new group
  const rnd = utilService.makeId();
  return {
    'id': rnd,
    'title': 'New List',
    'tasks': [],
    "style": {
      "bgColor": "#ebecf0"
    }
  }
}

function getById(board, id) { // get task by Id
  var task = null
  const groups = board.groups.map(group => group)
  for (var i = 0; i < groups.length; i++) {
    var currGroup = groups[i].tasks
    for (var j = 0; j < currGroup.length; j++) {
      if (currGroup[j].id === id) task = currGroup[j]
    }
  }
  return task
}

async function saveBoard(boardToUpdate, boardIdx) { // update board
  console.log(JSON.stringify(boardToUpdate));
  return httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
}

async function addBoard() { // add empty board
  const board = await httpService.post('board', null);
  return board
}

async function query(filterBy = {}) { // get all boards
  return httpService.get('board');
}