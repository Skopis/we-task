import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'

export const cardService = {
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
      "cardId": "t101"
    }]
  }
}

function query(filterBy = {}) {

  return {
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
    "lists": [
      {
        "id": "g101",
        "title": "List 1",
        "cards": [
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
        "cards": [
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
        "card": {
          "id": "c101",
          "title": "Replace Logo"
        }
      }
    ]
  }

  // var queryStr = (!filterBy) ? '' : `?name=${filterBy.name}&sort=anaAref`
  // return httpService.get(`card${queryStr}`)
  // return storageService.query('card')
}

function remove(cardId) {
  // return httpService.delete(`card/${cardId}`)
  return storageService.delete('card', cardId)

}
async function add(card) {
  // const addedCard = await httpService.post(`card`, card)

  card.byUser = userService.getLoggedinUser()
  card.aboutUser = await userService.getById(card.aboutUserId)
  const addedCard = storageService.post('card', card)

  return addedCard
}
