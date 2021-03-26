const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')

async function query(filterBy = {}) {
    try {
        const collection = await dbService.getCollection('board')
        var boards = await collection.find().toArray();
        // console.log("boards at board service", boards);
        if (boards.length === 0) {
            boards = await save(_getEmptyBoard());
        }
        return boards
    } catch (err) {
        logger.error('cannot find boards', err)
        throw err
    }
}


async function getById(boardId) {
    try {
        const collection = await dbService.getCollection('board');
        const board = await collection.findOne({ _id: ObjectId(boardId) });
        return board;
    } catch (err) {
        throw err;
    }
}

async function remove(boardId) {
    try {
        // const store = asyncLocalStorage.getStore();
        const collection = await dbService.getCollection('board')
        const query = { _id: ObjectId(boardId) }
        await collection.deleteOne(query)
    } catch (err) {
        logger.error(`cannot remove board ${boardId}`, err)
        throw err
    }
}

async function save(board) {
    try {
        let savedBoard = null;
        const collection = await dbService.getCollection('board');
        if (board && board._id) {
            const boardToUpdate = { ...board };
            delete boardToUpdate._id;
            await collection.updateOne({ _id: ObjectId(board._id) }, { $set: { ...boardToUpdate } });
            return board;
        } else {
            const newBoard = _getLongBoards();
            savedBoard = await collection.insert(newBoard);
            console.log('savedBoard', savedBoard)
            return newBoard
            // return savedBoard.ops[0];
        }
    } catch (err) {
        console.log("board err");
        throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

function _getEmptyBoard() {
    const newBoard = {
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
            }
        ],
        "createdAt": Date.now(),
        "groups": [
            {
                "id": _createRandomId(),
                "title": "New Group",
                "tasks": [],
                "style": {
                    "bgColor": "#b1c294"
                },
            }
        ]
    }
    return newBoard;
}

function _getLongBoards() {
    return [
        {
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
                }
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
                    "imgUrl": ""
                },
                {
                    "_id": "u177",
                    "fullname": "Lian Skopis",
                    "username": "lianskopis",
                    "imgUrl": ""
                },
                {
                    "_id": "u777",
                    "fullname": "Itay Azulay",
                    "username": "itayazulay",
                    "imgUrl": ""
                }
            ],
            "groups": [
                {
                    "id": "g101",
                    "title": "Project Resources",
                    "tasks": [
                        {
                            "id": "c101",
                            "title": "Project \"Teamwork Dream Work\" Launch Timeline",
                            "style": {
                                "bgColor": "#ffffff"
                            },
                            "members": [
                                {
                                    "_id": "u103",
                                    "fullname": "Guest",
                                    "username": "guest",
                                    "imgUrl": ""
                                },
                                {
                                    "_id": "u177",
                                    "fullname": "Lian Skopis",
                                    "username": "lianskopis",
                                    "imgUrl": ""
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
                            "labels": [],
                            "members": []
                        },
                        {
                            "id": "c1014",
                            "title": "Stakeholders",
                            "style": {
                                "bgColor": "#ffffff"
                            },
                            "labels": [],
                            "members": []
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
                                    "imgUrl": ""
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
                                    "createdAt": 159099981,
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
                                    "imgUrl": ""
                                },
                                {
                                    "_id": "u177",
                                    "fullname": "Lian Skopis",
                                    "username": "lianskopis",
                                    "imgUrl": ""
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
                            "labelIds": [
                                "101"
                            ],
                            "createdAt": 1590999730348,
                            "byMember": {
                                "_id": "u177",
                                "fullname": "Lian Skopis",
                                "imgUrl": ""
                            }
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
                                    "imgUrl": ""
                                }
                            ],
                            "comments": [
                                {
                                    "txt": "Hey you",
                                    "id": "cW5MN",
                                    "createdAt": 1616420836,
                                    "byMember": {
                                        "fullname": "Guest",
                                        "_id": "u103",
                                        "imgUrl": ""
                                    }
                                },
                                {
                                    "txt": "@guest no, you",
                                    "id": "jTqPd",
                                    "createdAt": 1616423149235,
                                    "byMember": {
                                        "fullname": "Guest",
                                        "_id": "u103",
                                        "imgUrl": ""
                                    }
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
                                    "createdAt": 159099981,
                                    "byMember": {
                                        "_id": "u177",
                                        "fullname": "Lian Skopis",
                                        "imgUrl": ""
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
                                    "imgUrl": ""
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
                            "labelIds": [
                                "101"
                            ],
                            "createdAt": 1590899770748,
                            "byMember": {
                                "_id": "u103",
                                "fullname": "Guest",
                                "imgUrl": ""
                            }
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
                                    "imgUrl": ""
                                },
                                {
                                    "_id": "u177",
                                    "fullname": "Lian Skopis",
                                    "imgUrl": ""
                                }
                            ]
                        },
                        {
                            "id": "c101474",
                            "title": "Await final approval",
                            "style": {
                                "bgColor": "#ffffff"
                            },
                            "labels": []
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
                                    "createdAt": 15909998176,
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
                                    "imgUrl": ""
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
                            "labelIds": [
                                "101"
                            ],
                            "createdAt": 1590899770748,
                            "byMember": {
                                "_id": "u103",
                                "fullname": "Guest",
                                "imgUrl": ""
                            }
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
                            "members": [],
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
                                    "createdAt": 15909568174,
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
                                    "imgUrl": ""
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
                            "labelIds": [
                                "101"
                            ],
                            "createdAt": 1590899770748,
                            "byMember": {
                                "_id": "u102",
                                "fullname": "Nofar Gabso",
                                "imgUrl": ""
                            }
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
                            "title": "Finalize Campaign Name: WeTaskBigger",
                            "style": {
                                "bgColor": "#ffffff"
                            },
                            "labels": [],
                            "members": [
                                {
                                    "_id": "u103",
                                    "fullname": "Guest",
                                    "username": "guest",
                                    "imgUrl": ""
                                },
                                {
                                    "_id": "u177",
                                    "username": "lianskopis",
                                    "fullname": "Lian Skopis",
                                    "imgUrl": ""
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
                    "txt": "Added a comment",
                    "createdAt": 15451456789,
                    "byMember": {
                        "_id": "u102",
                        "fullname": "Nofar Gabso",
                        "imgUrl": ""
                    },
                    "task": {
                        "id": "c10134",
                        "title": "Finalize Campaign Name: WeTaskBigger"
                    }
                },
                {
                    "id": "a102",
                    "txt": "Changed DueDate",
                    "createdAt": 154514,
                    "byMember": {
                        "_id": "u177",
                        "fullname": "Lian Skopis",
                        "imgUrl": ""
                    },
                    "task": {
                        "id": "c101234",
                        "title": "Submit Q1 report"
                    }
                },
                {
                    "id": "a103",
                    "txt": "Added Label",
                    "createdAt": 154514,
                    "byMember": {
                        "_id": "u102",
                        "fullname": "Nofar Gabso",
                        "imgUrl": ""
                    },
                    "task": {
                        "id": "c10177",
                        "title": "Freelancer contracts"
                    }
                }
            ]
        },
        {
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
                }
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
                    "imgUrl": ""
                },
                {
                    "_id": "u103",
                    "fullname": "Guest",
                    "username": "guest",
                    "imgUrl": ""
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
                                    "imgUrl": ""
                                },
                                {
                                    "_id": "u177",
                                    "fullname": "Lian Skopis",
                                    "username": "lianskopis",
                                    "imgUrl": ""
                                }
                            ]
                        },
                        {
                            "id": "c102a",
                            "title": "Update Samples",
                            "style": {
                                "bgColor": "#ffffff"
                            },
                            "labels": [],
                            "members": []
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
                            "members": [
                                {
                                    "_id": "u103",
                                    "fullname": "Guest",
                                    "username": "guest",
                                    "imgUrl": ""
                                }
                            ]
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
                                    "createdAt": 1590999817436,
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
                            "labelIds": [
                                "101"
                            ],
                            "createdAt": 1590999730348,
                            "byMember": {
                                "_id": "u101",
                                "fullname": "Shachar Dorfzaun",
                                "imgUrl": ""
                            }
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
        }
    ]
}

function _createRandomId() {
    return '_' + Math.random().toString(36).substr(2, 12);
}

module.exports = {
    query,
    remove,
    save,
    getById
}


