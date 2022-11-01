const socket = io()


// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationButton = document.querySelector('#send-location')
const $u_name = document.querySelector('.message__name')
const $avatar = document.querySelector('#u_avatar')
const $li_avatar = document.querySelector('#u_li_avatar')
const $messages = document.querySelector('#messages')
const inputAvatar = document.querySelector('#message-form .avatar')



// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const containerHeight = $messages.scrollHeight

    // how far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }

}


socket.on('message', (message) => {
    console.log(message);
    
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        color: message.color,
        avatar: message.avatar,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html);

    const u_color = message.color
    document.querySelector('#user_color').style.color = u_color;
    autoscroll()
})

socket.on('locationMessage', (message) => {
    console.log(message);
    const urlHtml = Mustache.render(locationTemplate, {
        username: message.username,
        avatar: message.avatar,
        color: message.color,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', urlHtml)
    autoscroll()
})



// socket.on('locationMessage', (url) => {
//     console.log(url);
// })

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const mes = e.target.elements.message.value
    socket.emit('sendMessage', mes, (error) => {
        // enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()

        if(error){
            return console.log(error);
        }
        console.log("Message delivered!");
    });
})


$locationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')

            console.log('Location is shared!!');
        })
    })
})

const getAvatar = () => {
    const size = Math.floor(Math.random() * 100) + 25;

    return `url(https://www.placecage.com/${size}/${size})`;
};

var avatar = getAvatar()

socket.emit('join', { username, room, avatar }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }

    $avatar.style.backgroundImage = avatar;
    $avatar.style.backgroundSize = 'contain';
}) 