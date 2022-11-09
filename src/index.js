const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
let randomColor = require('randomcolor')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { getUser, removeUser, addUser, getUsersInRoom, getAvatar } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


// let count = 0; 

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    
    socket.on('join', ( options, callback) => {
        let color = randomColor();
        const avatar = getAvatar()
        // console.log(avatar);

        const {error, user} = addUser({ id: socket.id, color, avatar, ...options })

        if(error){
            return callback(error)
        }

        socket.join(user.room)
        
        socket.emit('message', generateMessage('Admin', "#c5c3c1", "Welcome!!", "A"));
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room),
            color: user.color,
            avatar: user.avatar
        })

        callback()
    })

    socket.on('sendMessage', (mes, callback) => {
        const user = getUser(socket.id)
        
        const filter = new Filter();

        if(filter.isProfane(mes)){
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, user.color, mes, user.avatar));
        callback()
    })
    
    socket.on('sendLocation', (coords, callback) => {
        // io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}` )
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, user.color, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`, user.avatar))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room),
                color: user.color,
                avatar: user.avatar
            })
        }

    })


})


server.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})