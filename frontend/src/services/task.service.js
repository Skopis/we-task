import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'

export const taskService = {
  add,
  query,
  remove,
  getUser,
  getById,
  getEmptyBoard,
  addBoard,
  saveBoard,
  saveGroup
}


// More ways to send query params:
// return axios.get('api/toy/?id=1223&balance=13')
// return axios.get('api/toy/?', {params: {id: 1223, balanse:13}})
function getUser() {
  return {
    "_id": "u101",
    "fullname": "Abi Abambi",
    "username": "abi@ababmi.com",
    "password": "aBambi123",
    "imgUrl": "http://some-img.jpg",
    "mentions": [{
      "id": "m101",
      "boardId": "m101",
      "taskId": "t101"
    }]
  }
}

async function saveGroup(group, boardIdx, groupIdx){
  var boards = await storageService.query('boards')
  boards[boardIdx].groups.splice(groupIdx, 1, group)
  storageService._save('boards', boards)
}

async function saveBoard(boardToUpdate, boardIdx){
  var boards = await storageService.query('boards')
  boards.splice(boardIdx, 1, boardToUpdate)
  storageService._save('boards', boards)
}

async function addBoard(boardToAdd) {
  var boards = await storageService.query('boards')
  boards.push(boardToAdd)
  storageService._save('boards', boards)
}

function getEmptyBoard() {
  return {
    '_id': utilService.makeId(),
    'title': 'New board',
    'createdAt': Date.now(),
    'groups': {
      'id': utilService.makeId(),
      'title': 'New Group',
    }
  }
}

async function query(filterBy = {}) {
  var boards = await storageService.query('boards')
  if (!boards || !boards.length) {
    boards = [{
      "_id": "b101",
      "title": "First Board",
      "createdAt": 1589983468418,
      "createdBy": {
        "_id": "u101",
        "fullname": "Abi Abambi",
        "imgUrl": "http://some-img"
      },
      "style": {},
      "labels": [
        {
          "id": "l101",
          "title": "Done",
          "color": "#61bd4f"
        }
      ],
      "members": [
        {
          "_id": "u101",
          "fullname": "Tal Tarablus",
          "imgUrl": "https://www.google.com"
        }
      ],
      "groups": [
        {
          "id": "g101",
          "title": "Group 1",
          "tasks": [
            {
              "id": "c101",
              "title": "Replace logo"
            },
            {
              "id": "c102",
              "title": "Add Samples"
            }
          ],
          "style": {}
        },
        {
          "id": "g102",
          "title": "Group 2",
          "tasks": [
            {
              "id": "c103",
              "title": "Do that"
            },
            {
              "id": "c104",
              "title": "Help me",
              "description": "description",
              "comments": [
                {
                  "id": "ZdPnm",
                  "txt": "also @yaronb please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u101",
                    "fullname": "Tal Tarablus",
                    "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmF",
                  "title": "Checkgroup",
                  "todos": [
                    {
                      "id": "212jX",
                      "title": "To Do 1",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u101",
                  "username": "Tal",
                  "fullname": "Tal Tarablus",
                  "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590999730348,
              "dueDate": 16156215211,
              "byMember": {
                "_id": "u101",
                "username": "Tal",
                "fullname": "Tal Tarablus",
                "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
              },
              "style": {
                "bgColor": "#26de81"
              }
            }
          ],
          "style": {}
        }
      ],
      "activities": [
        {
          "id": "a101",
          "txt": "Changed Color",
          "createdAt": 154514,
          "byMember": {
            "_id": "u101",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c101",
            "title": "Replace Logo"
          }
        },
        {
          "id": "a102",
          "txt": "Added due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u101",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c102",
            "title": "Replace Logo"
          }
        },
        {
          "id": "a103",
          "txt": "Added due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u101",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c104",
            "title": "Replace Logo"
          }
        }
      ]
    },
    {
      "_id": "b1013",
      "title": "Second board",
      "createdAt": 1589983468418,
      "createdBy": {
        "_id": "u1013",
        "fullname": "Abi Abambi",
        "imgUrl": "http://some-img"
      },
      "style": {},
      "labels": [
        {
          "id": "l1013",
          "title": "Done",
          "color": "#61bd4f"
        }
      ],
      "members": [
        {
          "_id": "u10133",
          "fullname": "Tal Tarablus",
          "imgUrl": "https://www.google.com"
        }
      ],
      "groups": [
        {
          "id": "g1013",
          "title": "Group 1",
          "tasks": [
            {
              "id": "c1013",
              "title": "change logo"
            },
            {
              "id": "c1023",
              "title": "change Samples"
            }
          ],
          "style": {}
        },
        {
          "id": "g1023",
          "title": "Group 2",
          "tasks": [
            {
              "id": "c1033",
              "title": "make that"
            },
            {
              "id": "c10433",
              "title": "save me",
              "description": "This is a demo of how the desciption will look like",
              "comments": [
                {
                  "id": "ZdPnm3",
                  "txt": "also @yaronb please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u10133",
                    "fullname": "Tal Tarablus",
                    "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmF3",
                  "title": "Checkgroup",
                  "todos": [
                    {
                      "id": "212jX3",
                      "title": "To Do 2",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u10133",
                  "username": "Tal",
                  "fullname": "Tal Tarablus",
                  "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                }
              ],
              "labelIds": ["1013"],
              "createdAt": 1590999730348,
              "dueDate": 16156215211,
              "byMember": {
                "_id": "u10133",
                "username": "Tal",
                "fullname": "Tal Tarablus",
                "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
              },
              "style": {
                "bgColor": "#26de81"
              }
            }
          ],
          "style": {}
        }
      ],
      "activities": [
        {
          "id": "a1013",
          "txt": "Changed font",
          "createdAt": 154514,
          "byMember": {
            "_id": "u1013",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c1013",
            "title": "update Logo"
          }
        },
        {
          "id": "a1023",
          "txt": "changed due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u1013",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c1023",
            "title": "Replace Logo"
          }
        },
        {
          "id": "a1033",
          "txt": "Achanges due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u1013",
            "fullname": "Abi Abambi",
            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
          },
          "task": {
            "id": "c1043",
            "title": "update Logo"
          }
        }
      ]
    }]
  }
  // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  // return httpService.get(`task${queryStr}`)
  storageService._save('boards', boards)
  return boards
}

function remove(taskId) {
  // return httpService.delete(`task/${taskId}`)
  return storageService.delete('task', taskId)

}
async function add(task, groupIdx, taskIdx, boardIdx) {
  // const addedTask = await httpService.post(`task`, task)
  let boards = await query()
  var taskForUpdate = JSON.parse(JSON.stringify(task))
  if (taskIdx != -1) boards[boardIdx].groups[groupIdx].tasks.splice(taskIdx, 1, taskForUpdate)
  else {
    taskForUpdate.id = utilService.makeId()
    boards[boardIdx].groups[groupIdx].tasks.unshift(taskForUpdate)
  }
  storageService._save('boards', boards)
  return boards[boardIdx]
}

function getById(board, id) {
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
