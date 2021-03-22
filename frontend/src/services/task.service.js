import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'

export const taskService = {
  add,
  query,
  remove,
  getById,
  getUser,
  addBoard,
  addGroup,
  saveBoard,
  loadArchive,
  updateGroup,
  archiveGroup,
  archiveBoard,
  getEmptyGroup,
  // getEmptyBoard,
  handleGroupInSession,
  getGroupId
}

// More ways to send query params:
// return axios.get('api/toy/?id=1223&balance=13')
// return axios.get('api/toy/?', {params: {id: 1223, balanse:13}})
function getUser() { // TODO: is this really usefull?
  return {
    "_id": "u101",
    "fullname": "Guest",
    "imgUrl": "",
  }
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
  // var boards = await storageService.query('boards')
  // boards.splice(boardIdx, 1)
  // storageService._save('boards', boards)
  httpService.delete(`board/${board._id}`);

  var archive = await storageService.query('archive')
  if (archive) archive.push(board)
  else archive = [boardIdx]
  storageService._save('archive', archive)
}

async function archiveGroup(group, groupIdx, board) { //delete group and update
  // var boards = await storageService.query('boards')
  // boards[boardIdx].groups.splice(groupIdx, 1)
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.splice(groupIdx, 1);
  httpService.put(`board/${boardToUpdate._id}`,boardToUpdate);
  // storageService._save('boards', boards)

  var archive = await storageService.query('archive')
  if (archive) archive.push(group)
  else archive = [group]
  storageService._save('archive', archive)
}

async function addGroup(newGroup, board) { // add group and update board
  // var boards = await storageService.query('boards')
  // boards[boardIdx].groups.push(newGroup)
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.push(newGroup);
  httpService.put(`board/${board._id}`,boardToUpdate);
  // storageService._save('boards', boards)
}

async function updateGroup(group, board, groupIdx) { // update group and update board
  // var boards = await storageService.query('boards')
  // boards[boardIdx].groups.splice(groupIdx, 1, group)
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  boardToUpdate.groups.splice(groupIdx, 1, group)
  // storageService._save('boards', boards)
  httpService.put(`board/${boardToUpdate._id}`,boardToUpdate);
  return boardToUpdate
}

async function remove(board, groupIdx, taskIdx) { // remove task
  try {
    const boardToUpdate = JSON.parse(JSON.stringify(board))
    boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1)
    // storageService._save('boards', boards)
    await httpService.put(`board/${boardToUpdate._id}`,boardToUpdate);
    return query();
  } catch (err) {
    console.log('Cannot get boards', err)
  }
}

async function add(task, groupIdx, board) { // add task
  var taskForUpdate = JSON.parse(JSON.stringify(task))
  const boardToUpdate = JSON.parse(JSON.stringify(board))
  if (task.id) {
    var taskIdx = boardToUpdate.groups[groupIdx].tasks.findIndex(t => t.id === task.id)
    boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1, taskForUpdate)
  }
  else {
    taskForUpdate.id = utilService.makeId()
    boardToUpdate.groups[groupIdx].tasks.unshift(taskForUpdate)
  }
  await httpService.put(`board/${boardToUpdate._id}`,boardToUpdate);
  return boardToUpdate;
}

function getEmptyGroup() { // create a new group
  const rnd = utilService.makeId();
  console.log(rnd);
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
  return httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
  // var boards = await storageService.query('boards')
  // boards.splice(boardIdx, 1, boardToUpdate)
  // storageService._save('boards', boards)
}

async function addBoard() { // add empty board
  // var boards = await storageService.query('boards')
  const board = await httpService.post('board', null);
  // boards.push(board);
  // storageService._save('boards', boards)
  return board
}

async function query(filterBy = {}) { // get all boards
  // var boards = await storageService.query('boards')
  return httpService.get('board');
  // if (!boards || !boards.length) {
  //   boards = getLongBoards();
  // }
  // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  // return httpService.get(`task${queryStr}`)
  // storageService._save('boards', boards)
  // return boards
}





// import { httpService } from './http.service'
// import { storageService } from './async-storage.service'
// import { userService } from './user.service'
// import { utilService } from './util.service'

// export const taskService = {
//   add,
//   query,
//   remove,
//   getById,
//   getUser,
//   addBoard,
//   addGroup,
//   saveBoard,
//   loadArchive,
//   updateGroup,
//   archiveGroup,
//   archiveBoard,
//   getEmptyGroup,
//   getEmptyBoard,
//   handleGroupInSession,
//   getGroupId
// }

// // More ways to send query params:
// // return axios.get('api/toy/?id=1223&balance=13')
// // return axios.get('api/toy/?', {params: {id: 1223, balanse:13}})
// function getUser() { // TODO: is this really usefull?
//   return {
//     "_id": "u101",
//     "fullname": "Guest",
//     "imgUrl": "",
//   }
// }

// function getEmptyGroup() {
//   return {
//     "id": utilService.makeId(),
//     "title": "New List",
//     "tasks": [],
//     "style": {
//       "bgColor": "#ebecf0"
//     }
//   }
// }
// function handleGroupInSession(status, groupId) {
//   var currGroup = groupId
//   if (status === 'saveToSession') {
//     storageService.saveToSessionStorage('groupId', groupId)
//     return currGroup
//   }
//   else if (status === 'removeFromSession') {
//     currGroup = storageService.removeSessionStorage('groupId')
//     return currGroup = null
//   }

// }

// async function getGroupId() { // get groupId from session
//   const groupId = storageService.getFromSessionStorage('groupId')
//   return groupId
// }

// async function loadArchive() {
//   const archive = await storageService.query('archive')
//   return archive
// }

// async function archiveBoard(board, boardIdx) { // remove board
//   // var boards = await storageService.query('boards')
//   // boards.splice(boardIdx, 1)
//   // storageService._save('boards', boards)
//   httpService.delete(`board/${board._id}`);

//   var archive = await storageService.query('archive')
//   if (archive) archive.push(board)
//   else archive = [boardIdx]
//   storageService._save('archive', archive)
// }

// async function archiveGroup(group, groupIdx, board) { //delete group and update
//   // var boards = await storageService.query('boards')
//   // boards[boardIdx].groups.splice(groupIdx, 1)
//   const boardToUpdate = JSON.parse(JSON.stringify(board))
//   boardToUpdate.groups.splice(groupIdx, 1);
//   httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
//   // storageService._save('boards', boards)

//   var archive = await storageService.query('archive')
//   if (archive) archive.push(group)
//   else archive = [group]
//   storageService._save('archive', archive)
// }

// async function addGroup(newGroup, board) { // add group and update board
//   // var boards = await storageService.query('boards')
//   // boards[boardIdx].groups.push(newGroup)
//   const boardToUpdate = JSON.parse(JSON.stringify(board))
//   boardToUpdate.groups.push(newGroup);
//   httpService.put(`board/${board._id}`, boardToUpdate);
//   // storageService._save('boards', boards)
// }

// async function updateGroup(group, board, groupIdx) { // update group and update board
//   // var boards = await storageService.query('boards')
//   // boards[boardIdx].groups.splice(groupIdx, 1, group)
//   const boardToUpdate = JSON.parse(JSON.stringify(board))
//   boardToUpdate.groups.splice(groupIdx, 1, group)
//   // storageService._save('boards', boards)
//   httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
// }

// async function remove(board, groupIdx, taskIdx) { // remove task
//   try {
//     const boardToUpdate = JSON.parse(JSON.stringify(board))
//     boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1)
//     // storageService._save('boards', boards)
//     await httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
//     return query();
//   } catch (err) {
//     console.log('Cannot get boards', err)
//   }
// }

// async function add(task, groupIdx, taskIdx, board) { // add task
//   // const addedTask = await httpService.post(`task`, task)
//   // let boards = await query()
//   var taskForUpdate = JSON.parse(JSON.stringify(task))
//   const boardToUpdate = JSON.parse(JSON.stringify(board))
//   if (taskIdx != -1) boardToUpdate.groups[groupIdx].tasks.splice(taskIdx, 1, taskForUpdate)
//   else {
//     taskForUpdate.id = utilService.makeId()
//     boardToUpdate.groups[groupIdx].tasks.unshift(taskForUpdate)
//   }
//   // storageService._save('boards', boards)
//   await httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
//   return boardToUpdate;
// }

// function getEmptyGroup() { // create a new group
//   const rnd = utilService.makeId();
//   console.log(rnd);
//   return {
//     "_id": utilService.makeId(),
//     "title": "New Board",
//     "style": {
//       "bgColor": "#ebecf0"
//     }
//   }
// }

// function getById(board, id) { // get task by Id
//   var task = null
//   const groups = board.groups.map(group => group)
//   for (var i = 0; i < groups.length; i++) {
//     var currGroup = groups[i].tasks
//     for (var j = 0; j < currGroup.length; j++) {
//       if (currGroup[j].id === id) task = currGroup[j]
//     }
//   }
//   return task
// }

// async function saveBoard(boardToUpdate, boardIdx) { // update board
//   return httpService.put(`board/${boardToUpdate._id}`, boardToUpdate);
//   // var boards = await storageService.query('boards')
//   // boards.splice(boardIdx, 1, boardToUpdate)
//   // storageService._save('boards', boards)
// }

// async function addBoard() { // add empty board
//   // var boards = await storageService.query('boards')
//   const board = await httpService.post('board');
//   // boards.push(board);
//   // storageService._save('boards', boards)
// }

// async function query(filterBy = {}) { // get all boards
//   // var boards = await storageService.query('boards')
//   return httpService.get('board');
//   // if (!boards || !boards.length) {
//   //   boards = getLongBoards();
//   // }
//   // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
//   // return httpService.get(`task${queryStr}`)
//   // storageService._save('boards', boards)
//   // return boards
// }

// function getLongBoards() {
//   return [{
//     "_id": "b101",
//     "title": "Project Management",
//     "createdAt": 1589983468418,
//     "createdBy": {
//       "_id": "u102",
//       "nickname": "Nofar",
//       "fullname": "Nofar Gabso",
//       "imgUrl": ""
//     },
//     "style": {
//       "bgColor": "#d8c9ff"
//     },
//     "labels": [
//       {
//         "id": "l101",
//         "title": "Done",
//         "color": "green"
//       },
//       {
//         "id": "l102",
//         "title": "",
//         "color": "yellow"
//       },
//       {
//         "id": "l103",
//         "title": "",
//         "color": "orange"
//       },
//       {
//         "id": "l104",
//         "title": "",
//         "color": "red"
//       },
//       {
//         "id": "l105",
//         "title": "",
//         "color": "purple"
//       },
//       {
//         "id": "l106",
//         "title": "",
//         "color": "blue"
//       },
//     ],
//     "createdAt": Date.now(),
//     "groups": [{
//       "id": utilService.makeId(),
//       "title": "New List",
//       "tasks": [],
//       "style": {
//         "bgColor": "#ebecf0"
//       }
//     }]
//   }]
// }

// async function remove(boardIdx, groupIdx, taskIdx) {
//   // return httpService.delete(`task/${taskId}`)
//   try {
//     let boards = await query()
//     boards[boardIdx].groups[groupIdx].tasks.splice(taskIdx, 1)
//     storageService._save('boards', boards)
//     return boards
//   } catch (err) {
//     console.log('Cannot get boards', err)
//   }
// }
// async function add(task, groupIdx, taskIdx, boardIdx) {
//   // const addedTask = await httpService.post(`task`, task)
//   let boards = await query()
//   var taskForUpdate = JSON.parse(JSON.stringify(task))
//   if (taskIdx != -1) boards[boardIdx].groups[groupIdx].tasks.splice(taskIdx, 1, taskForUpdate)
//   else {
//     taskForUpdate.id = utilService.makeId()
//     boards[boardIdx].groups[groupIdx].tasks.unshift(taskForUpdate)
//   }
//   storageService._save('boards', boards)
//   return boards[boardIdx]
// }

// function getById(board, id) {
//   var task = null
//   const groups = board.groups.map(group => group)
//   for (var i = 0; i < groups.length; i++) {
//     var currGroup = groups[i].tasks
//     for (var j = 0; j < currGroup.length; j++) {
//       if (currGroup[j].id === id) task = currGroup[j]
//     }
//   }
//   return task
// }


// async function query(filterBy = {}) {
//   var boards = await storageService.query('boards')
//   if (!boards || !boards.length) {
//     boards = [{
//       "_id": "b101",
//       "title": "Project Management",
//       "createdAt": 1589983468418,
//       "createdBy": {
//         "_id": "u102",
//         "username": "nofargabso",
//         "fullname": "Nofar Gabso",
//         "imgUrl": ""
//       },
//       "style": {
//         "bgColor": "#29cce5"
//       },
//       "labels": [
//         {
//           "id": "l101",
//           "title": "Done",
//           "color": "green"
//         },
//         {
//           "id": "l102",
//           "title": "",
//           "color": "yellow"
//         },
//         {
//           "id": "l103",
//           "title": "",
//           "color": "orange"
//         },
//         {
//           "id": "l104",
//           "title": "",
//           "color": "red"
//         },
//         {
//           "id": "l105",
//           "title": "",
//           "color": "purple"
//         },
//         {
//           "id": "l106",
//           "title": "",
//           "color": "blue"
//         },
//       ],
//       "members": [
//         {
//           "_id": "u101",
//           "username": "shachardorfzaun",
//           "fullname": "Shachar Dorfzaun",
//           "imgUrl": ""
//         },
//         {
//           "_id": "u102",
//           "username": "nofargabso",
//           "fullname": "Nofar Gabso",
//           "imgUrl": ""
//         },
//         {
//           "_id": "u103",
//           "fullname": "Guest",
//           "username": "guest",
//           "imgUrl": "",
//         },
//         {
//           "_id": "u177",
//           "fullname": "Lian Skopis",
//           "username": "lianskopis",
//           "imgUrl": "",
//         }
//       ],
//       "groups": [
//         {
//           "id": "g101",
//           "title": "Project Resources",
//           "tasks": [
//             {
//               "id": "c101",
//               "title": `Project "Teamwork Dream Work" Launch Timeline`,
//               "style": {
//                 "bgColor": "#ffffff"
//               },
//               "members": [
//                 {
//                   "_id": "u103",
//                   "fullname": "Guest",
//                   "username": "guest",
//                   "imgUrl": "",
//                 },
//                 {
//                   "_id": "u177",
//                   "fullname": "Lian Skopis",
//                   "username": "lianskopis",
//                   "imgUrl": "",
//                 }
//               ],
//               "labels": []
//             },
//             {
//               "id": "c1012",
//               "title": "Weekly Updates",
//               "style": {
//                 "bgColor": "#ffffff"
//               },
//               "labels": []
//             },
//             {
//               "id": "c1014",
//               "title": "Stakeholders",
//               "style": {
//                 "bgColor": "#ffffff"
//               },
//               "labels": []
//             }
//           ],
//           "style": {
//             "bgColor": "#ebecf0"
//           }
//         },
//         {
//           "id": "g102",
//           "title": "Questions for Next Meeting",
//           "tasks": [
//             {
//               "id": "c103",
//               "title": "Whos the best person to fix my HTML snag?",
//               "style": {
//                 "bgColor": "#ffffff"
//               },
//               "labels": [],
//               "members": [
//                 {
//                   "_id": "u103",
//                   "fullname": "Guest",
//                   "username": "guest",
//                   "imgUrl": "",
//                 }
//               ]
//             },
//             {
//               "id": "c104",
//               "title": "How can I get access to the super secret document?",
//               "style": {
//                 "bgColor": "#ffffff"
//               },
//               "labels": [],
//               "description": "Please find a way to open this file",
//               "comments": [
//                 {
//                   "id": "ZdPnm",
//                   "txt": "also @yaronb please CR this",
//                   "createdAt": 1590999817436.0,
//                   "byMember": {
//                     "_id": "u101",
//                     "fullname": "Shachar Dorfzaun",
//                     "imgUrl": ""
//                   }
//                 }
//               ],
//               "checkgroups": [
//                 {
//                   "id": "YEhmFtt",
//                   "title": "Checkgroup",
//                   "todos": [
//                     {
//                       "id": "212jXz",
//                       "title": "Edit Email drafts",
//                       "isDone": false
//                     }
//                   ]
//                 }
//               ],
//               "members": [
//                 {
//                   "_id": "u103",
//                   "fullname": "Guest",
//                   "username": "guest",
//                   "imgUrl": "",
//                 },
//                 {
//                   "_id": "u177",
//                   "fullname": "Lian Skopis",
//                   "username": "lianskopis",
//                   "imgUrl": "",
//                 },
//                 {
//                   "_id": "u102",
//                   "username": "nofargabso",
//                   "fullname": "Nofar Gabso",
//                   "imgUrl": ""
//                 },
//                 {
//                   "_id": "u107",
//                   "username": "Kobi",
//                   "fullname": "Kobi Tohar",
//                   "imgUrl": ""
//                 }
//               ],
//               "labelIds": ["101"],
//               "createdAt": 1590999730348,
//               "byMember": {
//                 "_id": "u177",
//                 "fullname": "Lian Skopis",
//                 'username': 'Lian',
//                 "imgUrl": "",
//               }
//             ],
//           "labels": []
//         },
//         {
//           "id": "c1012",
//           "title": "Weekly Updates",
//           "style": {
//             "bgColor": "#ebecf0"
//           },
//           "labels": []
//         },
//         {
//           "id": "c1014",
//           "title": "Stakeholders",
//           "style": {
//             "bgColor": "#b1c294"
//           },
//           "labels": []
//         }
//         },
//     {
//       "id": "g103",
//       "title": "To Do",
//       "tasks": [
//         {
//           "id": "c1013",
//           "title": "Sketch site banner",
//           "style": {
//             "bgColor": "#ffffff"
//           },
//           "labels": [],
//           "members": [
//             {
//               "_id": "u103",
//               "fullname": "Guest",
//               "username": "guest",
//               "imgUrl": "",
//             }
//           ]
//         },
//         {
//           "id": "c1057",
//           "title": "Please add permissions for new members",
//           "style": {
//             "bgColor": "#ffffff"
//           },
//           "labels": [],
//           "description": "description",
//           "comments": [
//             {
//               "id": "ZdPnmk",
//               "txt": "@dudug please CR this",
//               "createdAt": 1590999817436.0,
//               "byMember": {
//                 "_id": "u177",
//                 "fullname": "Lian Skopis",
//                 "imgUrl": "",
//               }
//             }
//           ],
//           "checkgroups": [
//             {
//               "id": "YEhmF",
//               "title": "Checkgroup",
//               "todos": [
//                 {
//                   "id": "212jX",
//                   "title": "Find the password",
//                   "isDone": false
//                 }
//               ]
//             }
//           ],
//           "members": [
//             {
//               "_id": "u103",
//               "fullname": "Guest",
//               "username": "guest",
//               "imgUrl": "",
//             },
//             {
//               "_id": "u101",
//               "username": "shachardorfzaun",
//               "fullname": "Shachar Dorfzaun",
//               "imgUrl": ""
//             }
//           ],
//           "labelIds": ["101"],
//           "createdAt": 1590899770748,
//           "byMember": {
//             "_id": "u103",
//             "fullname": "Guest",
//             'username': 'guest',
//             "imgUrl": "",
//           },
//         }
//       ],
//       "style": {
//         "bgColor": "#ebecf0"
//       }
//     },
//     {
//       "id": "g111",
//       "title": "Pending",
//       "tasks": [
//         {
//           "id": "c1017",
//           "title": "Legal review",
//           "style": {
//             "bgColor": "#ffffff"
//           },
//           "labels": [],
//           "members": [
//             {
//               "_id": "u103",
//               "fullname": "Guest",
//               "username": "guest",
//               "imgUrl": "",
//             },
//             {
//               "_id": "u177",
//               "fullname": "Lian Skopis",
//               "imgUrl": "",
//             }
//           ]
//         },
//         {
//           "id": "c101474",
//           "title": "Await final approval",
//           "style": {
//             "bgColor": "#ffffff"
//           },
//               {
//           "_id": "u101",
//           "username": "Shachar",
//           "fullname": "Shachar Dorfzaun",
//           "imgUrl": ""
//         }, {
//           "_id": "u107",
//           "username": "Kobi",
//           "fullname": "Kobi Tohar",
//           "imgUrl": ""
//         }
//       ],
//       "labelIds": ["101"],
//       "createdAt": 1590899770748,
//       "dueDate": 16156215211,
//       "byMember": {
//         "_id": "u103",
//         "fullname": "Guest",
//         "imgUrl": "",
//       },
//             {
//       "id": "c102374",
//       "title": "Fix Margin issue",
//       "style": {
//         "bgColor": "#ffffff"
//       },
//       "labels": []
//     },
//     {
//       "id": "c1015",
//       "title": "WorkFlow changed!!",
//       "style": {
//         "bgColor": "#ffffff"
//       },
//       "labels": [],
//       "description": "description",
//       "comments": [
//         {
//           "id": "ZdPntm",
//           "txt": "also @mikel please CR this",
//           "createdAt": 1590999817436.0,
//           "byMember": {
//             "_id": "u107",
//             "fullname": "Kobi Tohar",
//             "imgUrl": ""
//           }
//         }
//       ],
//       "checkgroups": [
//         {
//           "id": "YEhmFl",
//           "title": "Checkgroup",
//           "todos": [
//             {
//               "id": "212jXx",
//               "title": "Find the document",
//               "isDone": false
//             }
//           ]
//         }
//       ],
//       "members": [
//         {
//           "_id": "u103",
//           "fullname": "Guest",
//           "username": "guest",
//           "imgUrl": "",
//         },
//         {
//           "_id": "u101",
//           "username": "shachardorfzaun",
//           "fullname": "Shachar Dorfzaun",
//           "imgUrl": ""
//         },
//         {
//           "_id": "u107",
//           "fullname": "Kobi Tohar",
//           "imgUrl": ""
//         }
//       ],
//       "labelIds": ["101"],
//       "createdAt": 1590899770748,
//       "byMember": {
//         "_id": "u103",
//         "fullname": "Guest",
//         'username': 'guest',
//         "imgUrl": "",
//       },
//     }
//     ],
//       "style": {
//       "bgColor": "#ebecf0"
//     }
//   },
//   {
//     "id": "g118",
//       "title": "Blocked",
//         "tasks": [
//           {
//             "id": "c10177",
//             "title": "Freelancer contracts",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//               {
//             "_id": "u107",
//             "username": "Kobi",
//             "fullname": "Kobi Tohar",
//             "imgUrl": ""
//           }
//         ],
//           "labelIds": ["101"],
//             "createdAt": 1590899770748,
//               "dueDate": 16156215211,
//                 "byMember": {
//       "_id": "u103",
//         "fullname": "Guest",
//           "imgUrl": "",
//             },
//     {
//       "id": "c10157",
//         "title": "Social media assets",
//           "style": {
//         "bgColor": "#ffffff"
//       },
//       "labels": [],
//         "description": "The twitter banner looks great, can we get another version in red",
//           "comments": [
//             {
//               "id": "ZdPntmk",
//               "txt": "Sure thing, just attached!",
//               "createdAt": 1590956817436.0,
//               "byMember": {
//                 "_id": "u101",
//                 "fullname": "Shachar Dorfzaun",
//                 "imgUrl": ""
//               }
//             }
//           ],
//             "checkgroups": [
//               {
//                 "id": "YEhmFlk",
//                 "title": "Main Checkgroup",
//                 "todos": [
//                   {
//                     "id": "212jXxe",
//                     "title": "Check the DB error",
//                     "isDone": false
//                   }
//                 ]
//               }
//             ],
//               "members": [
//                 {
//                   "_id": "u103",
//                   "fullname": "Guest",
//                   "username": "guest",
//                   "imgUrl": "",
//                 },
//                 {
//                   "_id": "u101",
//                   "username": "shachardorfzaun",
//                   "fullname": "Shachar Dorfzaun",
//                   "imgUrl": ""
//                 }
//               ],
//                 "labelIds": ["101"],
//                   "createdAt": 1590899770748,
//                     "byMember": {
//         "_id": "u102",
//           "fullname": "Nofar Gabso",
//             "imgUrl": ""
//       },
//     }
//           ],
//     "style": {
//       "bgColor": "#ebecf0"
//     }
//   },
//   {
//     "id": "g10134",
//       "title": "Done",
//         "tasks": [
//           {
//             "id": "c10134",
//             "title": `Finalize Campaign Name: WeTaskBigger`,
//             "style": {
//               "bgColor": "#ffffff"
//             },
//             "labels": [],
//             "members": [
//               {
//                 "_id": "u103",
//                 "fullname": "Guest",
//                 "username": "guest",
//                 "imgUrl": "",
//               },
//               {
//                 "_id": "u177",
//                 "username": "lianskopis",
//                 "fullname": "Lian Skopis",
//                 "imgUrl": "",
//               }
//             ]
//           },
//           {
//             "id": "c101234",
//             "title": "Submit Q1 report",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//             "labels": []
//           },
//           {
//             "id": "c101239",
//             "title": "Get Manager approval",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//               {
//             "_id": "u101",
//             "username": "Shachar",
//             "fullname": "Shachar Dorfzaun",
//             "imgUrl": ""
//           }, {
//             "_id": "u107",
//             "username": "Kobi",
//             "fullname": "Kobi Tohar",
//             "imgUrl": ""
//           }
//         ],
//           "labelIds": ["101"],
//             "createdAt": 1590899770748,
//               "dueDate": 16156215211,
//                 "byMember": {
//       "_id": "u102",
//         "fullname": "Nofar Gabso",
//           "imgUrl": ""
//     },
//     {
//       "id": "c101434",
//         "title": "Campaign Proposal",
//           "style": {
//         "bgColor": "#ffffff"
//       },
//       "labels": []
//     }
//           ],
//     "style": {
//       "bgColor": "#ebecf0"
//     }
//         ],
//     "style": {
//       "bgColor": "#cc859a"
//     }
//   },
//   {
//     "id": "g10134",
//       "title": "Done",
//         "tasks": [
//           {
//             "id": "c10134",
//             "title": `Finalize Campaign Name: WeTaskBigger`,
//             "style": {
//               "bgColor": "#a4a9a7"
//             },
//             "labels": [],
//             "members": [
//               {
//                 "_id": "u103",
//                 "fullname": "Guest",
//                 'username': 'guest',
//                 "imgUrl": "",
//               },
//               {
//                 "_id": "u177",
//                 'username': 'Lian',
//                 "fullname": "Lian Skopis",
//                 "imgUrl": "",
//               }
//             ]
//           },
//           {
//             "id": "c101234",
//             "title": "Submit Q1 report",
//             "style": {
//               "bgColor": "#eecab6"
//             },
//             "labels": []
//           },
//           {
//             "id": "c101239",
//             "title": "Get Manager approval",
//             "style": {
//               "bgColor": "#d1f5f5"
//             },
//             "labels": []
//           },
//           {
//             "id": "c101434",
//             "title": "Campaign Proposal",
//             "style": {
//               "bgColor": "#ffff"
//             },
//             "labels": []
//           }
//         ],
//           "style": {
//       "bgColor": "#fbffd4"
//     }
//       ]
//   },
//   {
//     "_id": "b102",
//       "title": "Second Board",
//         "createdAt": 1589983468418,
//           "createdBy": {
//       "_id": "u102",
//         "username": "nofargabso",
//           "fullname": "Nofar Gabso",
//             "imgUrl": ""
//     },
//     "style": {
//       "bgColor": "#7bc86c"
//     },
//     "labels": [
//       {
//         "id": "l101",
//         "title": "",
//         "color": "green"
//       },
//       {
//         "id": "l102",
//         "title": "",
//         "color": "yellow"
//       },
//       {
//         "id": "l103",
//         "title": "Done",
//         "color": "orange"
//       },
//       {
//         "id": "l104",
//         "title": "",
//         "color": "red"
//       },
//       {
//         "id": "l105",
//         "title": "",
//         "color": "purple"
//       },
//       {
//         "id": "l106",
//         "title": "",
//         "color": "blue"
//       },
//     ],
//       "members": [
//         {
//           "_id": "u101",
//           "fullname": "Shachar Dorfzaun",
//           "imgUrl": ""
//         },
//         "task": {
//           "id": "c1019",
//           "title": `Project "WeTask" Timeline`,
//         }
//       },
//   {
//     "id": "a102",
//       "txt": "Removed bug in Backend",
//         "createdAt": 154514,
//           "byMember": {
//       "_id": "u177",
//         "fullname": "Lian Skopis",
//           "username": "lianskopis",
//             "imgUrl": "",
//         },
//     {
//       "_id": "u103",
//         "fullname": "Guest",
//           "username": "guest",
//             "imgUrl": "",
//         }
//       ],
//     "groups": [
//       {
//         "id": "g101a",
//         "title": "List 1",
//         "tasks": [
//           {
//             "id": "c101a",
//             "title": "Update logo",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//             "labels": [],
//             "members": [
//               {
//                 "_id": "u103",
//                 "fullname": "Guest",
//                 "username": "guest",
//                 "imgUrl": "",
//               },
//               {
//                 "_id": "u177",
//                 "fullname": "Lian Skopis",
//                 "username": "lianskopis",
//                 "imgUrl": "",
//               }
//             ]
//           },
//           {
//             "id": "c102a",
//             "title": "Update Samples",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//             "labels": []
//           }
//         ],
//         "style": {
//           "bgColor": "#ebecf0"
//         }
//       },
//       {
//         "id": "g102a",
//         "title": "List 2",
//         "tasks": [
//           {
//             "id": "c103a",
//             "title": "Do that",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//             "labels": [],
//             "members": [{
//               "_id": "u103",
//               "fullname": "Guest",
//               "username": "guest",
//               "imgUrl": "",
//             }]
//           },
//           {
//             "id": "c104a",
//             "title": "Assist me",
//             "style": {
//               "bgColor": "#ffffff"
//             },
//               {
//             "_id": "u177",
//             "fullname": "Lian Skopis",
//             'username': 'Lian',
//             "imgUrl": "",
//           }
//         ]
//       },
//       {
//         "id": "c102a",
//         "title": "Update Samples",
//         "style": {
//           "bgColor": "#ffff"
//         },
//         "labels": []
//       }
//     ],
//       "style": {
//       "bgColor": "#ebecf0"
//     }
//   },
//   {
//     "id": "g102a",
//       "title": "List 2",
//         "tasks": [
//           {
//             "id": "c103a",
//             "title": "Do that",
//             "style": {
//               "bgColor": "#ffff"
//             },
//             "labels": [],
//             "members": [{
//               "_id": "u103",
//               "fullname": "Guest",
//               'username': 'guest',
//               "imgUrl": "",
//             }]
//           },
//           {
//             "id": "c104a",
//             "title": "Assist me",
//             "style": {
//               "bgColor": "#ffff"
//             },
//             "labels": [],
//             "description": "description",
//             "comments": [
//               {
//                 "id": "ZdPnma",
//                 "txt": "also @marks please CR this",
//                 "createdAt": 1590999817436.0,
//                 "byMember": {
//                   "_id": "u101",
//                   "username": "shachardorfzaun",
//                   "fullname": "Shachar Dorfzaun",
//                   "imgUrl": ""
//                 }
//               ],
//             "labelIds": ["101"],
//             "createdAt": 1590999730348,
//             "byMember": {
//               "_id": "u101",
//               "username": "Shachar",
//               "fullname": "Shachar Dorfzaun",
//               "imgUrl": ""
//             }
//             ],
//           "labelIds": ["101"],
//             "createdAt": 1590999730348,
//               "dueDate": 16156215211,
//                 "byMember": {
//       "_id": "u101",
//         "fullname": "Shachar Dorfzaun",
//           "imgUrl": ""
//     },
//   }
//         ],
//   "style": {
//     "bgColor": "#ebecf0"
//   }
// }
//     ],
// "activities": [
//   {
//     "id": "a101a",
//     "txt": "Updated Color",
//     "createdAt": 154514,
//     "byMember": {
//       "_id": "u102",
//       "fullname": "Nofar Gabso",
//       "imgUrl": ""
//     },
//     "task": {
//       "id": "c101a",
//       "title": "Update Logo"
//     }
//   },
//   {
//     "id": "a102a",
//     "txt": "Updated due date",
//     "createdAt": 154514,
//     "byMember": {
//       "_id": "u102",
//       "fullname": "Nofar Gabso",
//       "imgUrl": ""
//     },
//     "task": {
//       "id": "c102a",
//       "title": "Update Samples"
//     }
//   },
//   {
//     "id": "a103a",
//     "txt": "Added due date",
//     "createdAt": 154514,
//     "byMember": {
//       "_id": "u102",
//       "fullname": "Nofar Gabso",
//       "imgUrl": ""
//     },
//     "task": {
//       "id": "c104a",
//       "title": "Assist me"
//     }
//   }
// ]
//   }]
// }

// function getEmptyBoard() { //TODO: Usefull?
//   return {
//     '_id': utilService.makeId(),
//     'title': 'New Board',
//     "style": {
//       "bgColor": "#b1c294"
//     },
//     "labels": [
//       {
//         "id": "l101",
//         "title": "",
//         "color": "green"
//       },
//       {
//         "id": "l102",
//         "title": "",
//         "color": "yellow"
//       },
//       {
//         "id": "l103",
//         "title": "Done",
//         "color": "orange"
//       },
//       {
//         "id": "l104",
//         "title": "",
//         "color": "red"
//       },
//       {
//         "id": "l105",
//         "title": "",
//         "color": "purple"
//       },
//       {
//         "id": "l106",
//         "title": "",
//         "color": "blue"
//       },
//     ],
//     'createdAt': Date.now(),
//     'groups': [{
//       'id': utilService.makeId(),
//       'title': 'New List',
//       'tasks': []
//     }]
//   }
// }