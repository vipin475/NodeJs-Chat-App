const generateMessage = (username, color, text) => {
    return{
        username,
        color,
        text,
        createdAt: new Date().getTime(),
    }
}

const generateLocationMessage = (username, color, url) => {
    return {
        username,
        color,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
}