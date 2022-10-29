const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase()

    if(!username || !room){
        return {
            error: 'Username and room are required'
        }
    }

    const existingUser = users.find((user) => {
        return user.room == room && user.username == username
    })

    if(existingUser){
        return {
            error: 'Username already in use'
        }
    }

    const user = {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index != -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    const usersInRoom = []

    users.forEach((user) => {
        if(user.room === room){
            usersInRoom.push(user)
        }
    })

    return usersInRoom
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}


// const getUsersInRoom = (room) => {
//     return users.filter((user) => user.room === room)
// }



// addUser({
//     id: 22,
//     username: 'John',
//     room: 'arrow'
// })

// addUser({
//     id: 33,
//     username: 'oliver',
//     room: 'arrow'
// })

// addUser({
//     id: 44,
//     username: 'barry',
//     room: 'flash'
// })

// addUser({
//     id: 55,
//     username: 'rene',
//     room: 'arrow'
// })

// console.log(getUser(44));
// console.log(getUsersInRoom('arrow'));


// const removedUser = removeUser(22);

// console.log(removedUser);
// console.log(users);

// const res = addUser({
//     id: 33,
//     username: "john",
//     room: 'arrow'
// })

// console.log(res);