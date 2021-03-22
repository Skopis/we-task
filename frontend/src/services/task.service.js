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
  getEmptyBoard,
  handleGroupInSession,
  getGroupId
}

// More ways to send query params:
// return axios.get('api/toy/?id=1223&balance=13')
// return axios.get('api/toy/?', {params: {id: 1223, balanse:13}})
function getUser() {
  return {
    "_id": "u101",
    "fullname": "Guest",
    "imgUrl": "",
  }
}

function getEmptyGroup() {
  return {
    "id": utilService.makeId(),
    "title": "New List",
    "tasks": [],
    "style": {
      "bgColor": "#ebecf0"
    }
  }
}
function handleGroupInSession(status, groupId) {
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
async function getGroupId() {
  const groupId = storageService.getFromSessionStorage('groupId')
  return groupId
}
async function loadArchive() {
  const archive = await storageService.query('archive')
  return archive
}
async function archiveBoard(board, boardIdx) {
  var boards = await storageService.query('boards')
  boards.splice(boardIdx, 1)
  storageService._save('boards', boards)

  var archive = await storageService.query('archive')
  if (archive) archive.push(board)
  else archive = [boardIdx]
  storageService._save('archive', archive)
}

async function archiveGroup(group, groupIdx, boardIdx) {
  var boards = await storageService.query('boards')
  boards[boardIdx].groups.splice(groupIdx, 1)
  storageService._save('boards', boards)

  var archive = await storageService.query('archive')
  if (archive) archive.push(group)
  else archive = [group]
  storageService._save('archive', archive)
}
async function addGroup(newGroup, boardIdx) {
  var boards = await storageService.query('boards')
  boards[boardIdx].groups.push(newGroup)
  storageService._save('boards', boards)
}

async function updateGroup(group, boardIdx, groupIdx) {
  var boards = await storageService.query('boards')
  boards[boardIdx].groups.splice(groupIdx, 1, group)
  storageService._save('boards', boards)
}

async function saveBoard(boardToUpdate, boardIdx) {
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
    "_id": utilService.makeId(),
    "title": "New Board",
    "style": {
      "bgColor": "#b1c294"
    },
    "labels": [
      {
        "id": "l101",
        "title": "",
        "color": "green"
      },
      {
        "id": "l102",
        "title": "",
        "color": "yellow"
      },
      {
        "id": "l103",
        "title": "Done",
        "color": "orange"
      },
      {
        "id": "l104",
        "title": "",
        "color": "red"
      },
      {
        "id": "l105",
        "title": "",
        "color": "purple"
      },
      {
        "id": "l106",
        "title": "",
        "color": "blue"
      },
    ],
    "createdAt": Date.now(),
    "groups": [{
      "id": utilService.makeId(),
      "title": "New List",
      "tasks": [],
      "style": {
        "bgColor": "#ebecf0"
      }
    }]
  }
}

async function remove(boardIdx, groupIdx, taskIdx) {
  // return httpService.delete(`task/${taskId}`)
  try {
    let boards = await query()
    boards[boardIdx].groups[groupIdx].tasks.splice(taskIdx, 1)
    storageService._save('boards', boards)
    return boards
  } catch (err) {
    console.log('Cannot get boards', err)
  }
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


async function query(filterBy = {}) {
  var boards = await storageService.query('boards')
  if (!boards || !boards.length) {
    boards = [{
      "_id": "b101",
      "title": "Project Management",
      "createdAt": 1589983468418,
      "createdBy": {
        "_id": "u102",
        "username": "nofargabso",
        "fullname": "Nofar Gabso",
        "imgUrl": ""
      },
      "style": {
        "bgColor": "#29cce5"
      },
      "labels": [
        {
          "id": "l101",
          "title": "Done",
          "color": "green"
        },
        {
          "id": "l102",
          "title": "",
          "color": "yellow"
        },
        {
          "id": "l103",
          "title": "",
          "color": "orange"
        },
        {
          "id": "l104",
          "title": "",
          "color": "red"
        },
        {
          "id": "l105",
          "title": "",
          "color": "purple"
        },
        {
          "id": "l106",
          "title": "",
          "color": "blue"
        },
      ],
      "members": [
        {
          "_id": "u101",
          "username": "shachardorfzaun",
          "fullname": "Shachar Dorfzaun",
          "imgUrl": ""
        },
        {
          "_id": "u102",
          "username": "nofargabso",
          "fullname": "Nofar Gabso",
          "imgUrl": ""
        },
        {
          "_id": "u103",
          "fullname": "Guest",
          "username": "guest",
          "imgUrl": "",
        },
        {
          "_id": "u177",
          "fullname": "Lian Skopis",
          "username": "lianskopis",
          "imgUrl": "",
        }
      ],
      "groups": [
        {
          "id": "g101",
          "title": "Project Resources",
          "tasks": [
            {
              "id": "c101",
              "title": `Project "Teamwork Dream Work" Launch Timeline`,
              "style": {
                "bgColor": "#ffffff"
              },
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u177",
                  "fullname": "Lian Skopis",
                  "username": "lianskopis",
                  "imgUrl": "",
                }
              ],
              "labels": []
            },
            {
              "id": "c1012",
              "title": "Weekly Updates",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            },
            {
              "id": "c1014",
              "title": "Stakeholders",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g102",
          "title": "Questions for Next Meeting",
          "tasks": [
            {
              "id": "c103",
              "title": "Whos the best person to fix my HTML snag?",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                }
              ]
            },
            {
              "id": "c104",
              "title": "How can I get access to the super secret document?",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "description": "Please find a way to open this file",
              "comments": [
                {
                  "id": "ZdPnm",
                  "txt": "also @yaronb please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u101",
                    "fullname": "Shachar Dorfzaun",
                    "imgUrl": ""
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmFtt",
                  "title": "Checkgroup",
                  "todos": [
                    {
                      "id": "212jXz",
                      "title": "Edit Email drafts",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u177",
                  "fullname": "Lian Skopis",
                  "username": "lianskopis",
                  "imgUrl": "",
                },
                {
                  "_id": "u102",
                  "username": "nofargabso",
                  "fullname": "Nofar Gabso",
                  "imgUrl": ""
                },
                {
                  "_id": "u107",
                  "username": "Kobi",
                  "fullname": "Kobi Tohar",
                  "imgUrl": ""
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590999730348,
              "byMember": {
                "_id": "u177",
                "fullname": "Lian Skopis",
                "imgUrl": "",
              },
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g103",
          "title": "To Do",
          "tasks": [
            {
              "id": "c1013",
              "title": "Sketch site banner",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                }
              ]
            },
            {
              "id": "c1057",
              "title": "Please add permissions for new members",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "description": "description",
              "comments": [
                {
                  "id": "ZdPnmk",
                  "txt": "@dudug please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u177",
                    "fullname": "Lian Skopis",
                    "imgUrl": "",
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
                      "title": "Find the password",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u101",
                  "username": "shachardorfzaun",
                  "fullname": "Shachar Dorfzaun",
                  "imgUrl": ""
                }, {
                  "_id": "u107",
                  "username": "Kobi",
                  "fullname": "Kobi Tohar",
                  "imgUrl": ""
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590899770748,
              "byMember": {
                "_id": "u103",
                "fullname": "Guest",
                "imgUrl": "",
              },
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g111",
          "title": "Pending",
          "tasks": [
            {
              "id": "c1017",
              "title": "Legal review",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u177",
                  "fullname": "Lian Skopis",
                  "imgUrl": "",
                }
              ]
            },
            {
              "id": "c101474",
              "title": "Await final approval",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
            },
            {
              "id": "c102374",
              "title": "Fix Margin issue",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            },
            {
              "id": "c1015",
              "title": "WorkFlow changed!!",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "description": "description",
              "comments": [
                {
                  "id": "ZdPntm",
                  "txt": "also @mikel please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u107",
                    "fullname": "Kobi Tohar",
                    "imgUrl": ""
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmFl",
                  "title": "Checkgroup",
                  "todos": [
                    {
                      "id": "212jXx",
                      "title": "Find the document",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u101",
                  "username": "shachardorfzaun",
                  "fullname": "Shachar Dorfzaun",
                  "imgUrl": ""
                },
                {
                  "_id": "u107",
                  "username": "Kobi",
                  "fullname": "Kobi Tohar",
                  "imgUrl": ""
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590899770748,
              "byMember": {
                "_id": "u103",
                "fullname": "Guest",
                "imgUrl": "",
              },
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g118",
          "title": "Blocked",
          "tasks": [
            {
              "id": "c10177",
              "title": "Freelancer contracts",
              "style": {
                "bgColor": "#ffffff"
              },
              "members": [
              ],
              "labels": []
            },
            {
              "id": "c10157",
              "title": "Social media assets",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "description": "The twitter banner looks great, can we get another version in red",
              "comments": [
                {
                  "id": "ZdPntmk",
                  "txt": "Sure thing, just attached!",
                  "createdAt": 1590956817436.0,
                  "byMember": {
                    "_id": "u101",
                    "fullname": "Shachar Dorfzaun",
                    "imgUrl": ""
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmFlk",
                  "title": "Main Checkgroup",
                  "todos": [
                    {
                      "id": "212jXxe",
                      "title": "Check the DB error",
                      "isDone": false
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u101",
                  "username": "shachardorfzaun",
                  "fullname": "Shachar Dorfzaun",
                  "imgUrl": ""
                }, {
                  "_id": "u107",
                  "username": "Kobi",
                  "fullname": "Kobi Tohar",
                  "imgUrl": ""
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590899770748,
              "byMember": {
                "_id": "u102",
                "fullname": "Nofar Gabso",
                "imgUrl": ""
              },
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g10134",
          "title": "Done",
          "tasks": [
            {
              "id": "c10134",
              "title": `Finalize Campaign Name: WeTaskBigger`,
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u177",
                  "username": "lianskopis",
                  "fullname": "Lian Skopis",
                  "imgUrl": "",
                }
              ]
            },
            {
              "id": "c101234",
              "title": "Submit Q1 report",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            },
            {
              "id": "c101239",
              "title": "Get Manager approval",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            },
            {
              "id": "c101434",
              "title": "Campaign Proposal",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        }
      ],
      "activities": [
        {
          "id": "a1015",
          "txt": "Added Footer",
          "createdAt": 15451456789,
          "byMember": {
            "_id": "u102",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
          },
          "task": {
            "id": "c1019",
            "title": `Project "WeTask" Timeline`,
          }
        },
        {
          "id": "a102",
          "txt": "Removed bug in Backend",
          "createdAt": 154514,
          "byMember": {
            "_id": "u177",
            "fullname": "Lian Skopis",
            "imgUrl": "",
          },
          "task": {
            "id": "c10299",
            "title": "Use color-picker component"
          }
        },
        {
          "id": "a103",
          "txt": "Changed due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u102",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
          },
          "task": {
            "id": "c1044",
            "title": "Changed font for all h1 tags"
          }
        }
      ]
    },
    {
      "_id": "b102",
      "title": "Second Board",
      "createdAt": 1589983468418,
      "createdBy": {
        "_id": "u102",
        "username": "nofargabso",
        "fullname": "Nofar Gabso",
        "imgUrl": ""
      },
      "style": {
        "bgColor": "#7bc86c"
      },
      "labels": [
        {
          "id": "l101",
          "title": "",
          "color": "green"
        },
        {
          "id": "l102",
          "title": "",
          "color": "yellow"
        },
        {
          "id": "l103",
          "title": "Done",
          "color": "orange"
        },
        {
          "id": "l104",
          "title": "",
          "color": "red"
        },
        {
          "id": "l105",
          "title": "",
          "color": "purple"
        },
        {
          "id": "l106",
          "title": "",
          "color": "blue"
        },
      ],
      "members": [
        {
          "_id": "u101",
          "fullname": "Shachar Dorfzaun",
          "imgUrl": ""
        },
        {
          "_id": "u177",
          "fullname": "Lian Skopis",
          "username": "lianskopis",
          "imgUrl": "",
        },
        {
          "_id": "u103",
          "fullname": "Guest",
          "username": "guest",
          "imgUrl": "",
        }
      ],
      "groups": [
        {
          "id": "g101a",
          "title": "List 1",
          "tasks": [
            {
              "id": "c101a",
              "title": "Update logo",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [
                {
                  "_id": "u103",
                  "fullname": "Guest",
                  "username": "guest",
                  "imgUrl": "",
                },
                {
                  "_id": "u177",
                  "fullname": "Lian Skopis",
                  "username": "lianskopis",
                  "imgUrl": "",
                }
              ]
            },
            {
              "id": "c102a",
              "title": "Update Samples",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": []
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        },
        {
          "id": "g102a",
          "title": "List 2",
          "tasks": [
            {
              "id": "c103a",
              "title": "Do that",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "members": [{
                "_id": "u103",
                "fullname": "Guest",
                "username": "guest",
                "imgUrl": "",
              }]
            },
            {
              "id": "c104a",
              "title": "Assist me",
              "style": {
                "bgColor": "#ffffff"
              },
              "labels": [],
              "description": "description",
              "comments": [
                {
                  "id": "ZdPnma",
                  "txt": "also @marks please CR this",
                  "createdAt": 1590999817436.0,
                  "byMember": {
                    "_id": "u101",
                    "fullname": "Shachar Dorfzaun",
                    "imgUrl": ""
                  }
                }
              ],
              "checkgroups": [
                {
                  "id": "YEhmFa",
                  "title": "Updategroup",
                  "todos": [
                    {
                      "id": "212jXa",
                      "title": "Curate customer list",
                      "isDone": true
                    }
                  ]
                }
              ],
              "members": [
                {
                  "_id": "u101",
                  "username": "shachardorfzaun",
                  "fullname": "Shachar Dorfzaun",
                  "imgUrl": ""
                }
              ],
              "labelIds": ["101"],
              "createdAt": 1590999730348,
              "byMember": {
                "_id": "u101",
                "fullname": "Shachar Dorfzaun",
                "imgUrl": ""
              },
            }
          ],
          "style": {
            "bgColor": "#ebecf0"
          }
        }
      ],
      "activities": [
        {
          "id": "a101a",
          "txt": "Updated Color",
          "createdAt": 154514,
          "byMember": {
            "_id": "u102",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
          },
          "task": {
            "id": "c101a",
            "title": "Update Logo"
          }
        },
        {
          "id": "a102a",
          "txt": "Updated due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u102",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
          },
          "task": {
            "id": "c102a",
            "title": "Update Samples"
          }
        },
        {
          "id": "a103a",
          "txt": "Added due date",
          "createdAt": 154514,
          "byMember": {
            "_id": "u102",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
          },
          "task": {
            "id": "c104a",
            "title": "Assist me"
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

