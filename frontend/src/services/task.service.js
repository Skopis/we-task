import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'

export const taskService = {
  add,
  query,
  remove,
  getUser
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

async function query(filterBy = {}) {
  var board = await storageService.query('board')
  if (!board || !board.length) {
    board = {
      "_id": "b101",
      "title": "Robot dev proj",
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
          "title": "List 1",
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
          "title": "List 2",
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
              "checklists": [
                {
                  "id": "YEhmF",
                  "title": "Checklist",
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
            "imgUrl": "http://some-img"
          },
          "task": {
            "id": "c101",
            "title": "Replace Logo"
          }
        }
      ]
    }
  }
  // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  // return httpService.get(`task${queryStr}`)
  storageService._save('board', board)
  return board
}

function remove(taskId) {
  // return httpService.delete(`task/${taskId}`)
  return storageService.delete('task', taskId)

}
async function add(task) {
  // const addedTask = await httpService.post(`task`, task)

  task.byUser = userService.getLoggedinUser()
  task.aboutUser = await userService.getById(task.aboutUserId)
  const addedTask = storageService.post('task', task)

  return addedTask
}
// function getById(){

// }