const generateMessage = (username, color, text, avatar) => {
    return{
        username,
        color,
        text,
        avatar,
        createdAt: new Date().getTime(),
    }
}

const generateLocationMessage = (username, color, url, avatar) => {
    return {
        username,
        color,
        url,
        avatar,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
}