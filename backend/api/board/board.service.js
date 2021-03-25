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
    return [{
        "title": "Project Management",
        "createdAt": 1589983468418,
        "createdBy": {
            "_id": "u102",
            "nickname": "Nofar",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
        },
        "style": {
            "bgColor": "#d8c9ff"
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
                "fullname": "Shachar Dorfzaun",
                "imgUrl": ""
            },
            {
                "_id": "u102",
                "nickname": "Nofar",
                "fullname": "Nofar Gabso",
                "imgUrl": ""
            },
            {
                "_id": "u103",
                "fullname": "Guest",
                'username': 'guest',
                "imgUrl": "",
            },
            {
                "_id": "u177",
                "fullname": "Lian Skopis",
                'username': 'Lian',
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
                            "bgColor": "#ffff"
                        },
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u177",
                                "fullname": "Lian Skopis",
                                'username': 'Lian',
                                "imgUrl": "",
                            }
                        ],
                        "labels": []
                    },
                    {
                        "id": "c1012",
                        "title": "Weekly Updates",
                        "style": {
                            "bgColor": "#ebecf0"
                        },
                        "labels": []
                    },
                    {
                        "id": "c1014",
                        "title": "Stakeholders",
                        "style": {
                            "bgColor": "#b1c294"
                        },
                        "labels": []
                    }
                ],
                "style": {
                    "bgColor": "#eecab6"
                }
            },
            {
                "id": "g102",
                "title": "Questions for Next Meeting",
                "tasks": [
                    {
                        "id": "c103",
                        "title": "Who's the best person to fix my HTML snag?",
                        "style": {
                            "bgColor": "#cc859a"
                        },
                        "labels": [],
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
                                "imgUrl": "",
                            }
                        ]
                    },
                    {
                        "id": "c104",
                        "title": "How can I get access to the super secret document?",
                        "style": {
                            "bgColor": "#ffff"
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
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u177",
                                "fullname": "Lian Skopis",
                                'username': 'Lian',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u102",
                                "username": "Nofar",
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
                        "dueDate": 16156215211,
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
                            "bgColor": "#ffff"
                        },
                        "labels": [],
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
                                "imgUrl": "",
                            }
                        ]
                    },
                    {
                        "id": "c1057",
                        "title": "Please add permissions for new members",
                        "style": {
                            "bgColor": "#fbffd4"
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
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u101",
                                "username": "Shachar",
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
                        "dueDate": 16156215211,
                        "byMember": {
                            "_id": "u103",
                            "fullname": "Guest",
                            "imgUrl": "",
                        },
                    }
                ],
                "style": {
                    "bgColor": "#b1c294"
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
                            "bgColor": "#ebecf0"
                        },
                        "labels": [],
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
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
                            "bgColor": "#eecab6"
                        },
                        "labels": [],
                    },
                    {
                        "id": "c102374",
                        "title": "Fix Margin issue",
                        "style": {
                            "bgColor": "#eecab6"
                        },
                        "labels": []
                    },
                    {
                        "id": "c1015",
                        "title": "WorkFlow changed!!",
                        "style": {
                            "bgColor": "#ebecf0"
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
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u101",
                                "username": "Shachar",
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
                        "dueDate": 16156215211,
                        "byMember": {
                            "_id": "u103",
                            "fullname": "Guest",
                            "imgUrl": "",
                        },
                    }
                ],
                "style": {
                    "bgColor": "#ffff"
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
                            "bgColor": "#d1f5f5"
                        },
                        "members": [
                        ],
                        "labels": []
                    },
                    {
                        "id": "c10157",
                        "title": "Social media assets",
                        "style": {
                            "bgColor": "#b1c294"
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
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u101",
                                "username": "Shachar",
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
                        "dueDate": 16156215211,
                        "byMember": {
                            "_id": "u102",
                            "fullname": "Nofar Gabso",
                            "imgUrl": ""
                        },
                    }
                ],
                "style": {
                    "bgColor": "#cc859a"
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
                            "bgColor": "#a4a9a7"
                        },
                        "labels": [],
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u177",
                                'username': 'Lian',
                                "fullname": "Lian Skopis",
                                "imgUrl": "",
                            }
                        ]
                    },
                    {
                        "id": "c101234",
                        "title": "Submit Q1 report",
                        "style": {
                            "bgColor": "#eecab6"
                        },
                        "labels": []
                    },
                    {
                        "id": "c101239",
                        "title": "Get Manager approval",
                        "style": {
                            "bgColor": "#d1f5f5"
                        },
                        "labels": []
                    },
                    {
                        "id": "c101434",
                        "title": "Campaign Proposal",
                        "style": {
                            "bgColor": "#ffff"
                        },
                        "labels": []
                    }
                ],
                "style": {
                    "bgColor": "#fbffd4"
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
        "title": "Second Board",
        "createdAt": 1589983468418,
        "createdBy": {
            "_id": "u102",
            "nickname": "Nofar",
            "fullname": "Nofar Gabso",
            "imgUrl": ""
        },
        "style": {
            "bgColor": "#ffff"
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
                'username': 'Lian',
                "imgUrl": "",
            },
            {
                "_id": "u103",
                "fullname": "Guest",
                'username': 'guest',
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
                            "bgColor": "#ffff"
                        },
                        "labels": [],
                        "members": [
                            {
                                "_id": "u103",
                                "fullname": "Guest",
                                'username': 'guest',
                                "imgUrl": "",
                            },
                            {
                                "_id": "u177",
                                "fullname": "Lian Skopis",
                                'username': 'Lian',
                                "imgUrl": "",
                            }
                        ]
                    },
                    {
                        "id": "c102a",
                        "title": "Update Samples",
                        "style": {
                            "bgColor": "#ffff"
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
                            "bgColor": "#ffff"
                        },
                        "labels": [],
                        "members": [{
                            "_id": "u103",
                            "fullname": "Guest",
                            'username': 'guest',
                            "imgUrl": "",
                        }]
                    },
                    {
                        "id": "c104a",
                        "title": "Assist me",
                        "style": {
                            "bgColor": "#ffff"
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
                                "username": "Shachar",
                                "fullname": "Shachar Dorfzaun",
                                "imgUrl": ""
                            }
                        ],
                        "labelIds": ["101"],
                        "createdAt": 1590999730348,
                        "dueDate": 16156215211,
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

function _createRandomId() {
    return '_' + Math.random().toString(36).substr(2, 12);
}

module.exports = {
    query,
    remove,
    save,
    getById
}


