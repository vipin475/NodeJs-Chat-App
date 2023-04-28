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
const $audio_play = document.querySelector("#myAudio");
const $iconChange = document.querySelector('link[rel=icon]') 

const $fileForm = document.querySelector('#fileForm');
const $fileInput = document.querySelector('#input');


// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const imageTemplate = document.querySelector('#image-template').innerHTML

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

// send message
socket.on('message', (message) => {
    let flag = true;
    console.log(message);
    
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        color: message.color,
        message: message.text,
        avatar: message.avatar,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    $audio_play.play()

    if(flag){
        if(!document.hasFocus()){
            document.title="New messages";
            $iconChange.href = '../img/icon-red.png'
        }
        else{
            document.title="Hellozuz";
            $iconChange.href = '../img/icon2.png'
        } 
    }
    flag = false;

    autoscroll()
})

// send location
socket.on('locationMessage', (message) => {
    console.log(message);
    const urlHtml = Mustache.render(locationTemplate, {
        username: message.username,
        color: message.color,
        url: message.url,
        avatar: message.avatar,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', urlHtml)
    $audio_play.play() 
    
    if(flag){
        if(!document.hasFocus()){
            document.title="New messages";
            $iconChange.href = '../img/icon-red.png'
        }
        else{
            document.title="Hellozuz";
            $iconChange.href = '../img/icon2.png'
        } 
    }
    flag = false;

    autoscroll()
})


// send image
socket.on('imageMessage', (message) => {
    let flag = true;
    console.log(message);
    
    const html = Mustache.render(imageTemplate, {
        username: message.username,
        color: message.color,
        imgD: message.imgD,
        avatar: message.avatar,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html);
    $audio_play.play()

    if(flag){
        if(!document.hasFocus()){
            document.title="New messages";
            $iconChange.href = '../img/icon-red.png'
        }
        else{
            document.title="Hellozuz";
            $iconChange.href = '../img/icon2.png'
        } 
    }
    flag = false;

    autoscroll()
})


// send room information to sidebar
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
    
})


// eventlistener to send message button
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


// eventlistener to send location button
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


// getting avatar from api
const getAvatar = () => {
    const size = Math.floor(Math.random() * 100) + 25;

    return `url(https://source.unsplash.com/random/${size}x${size}?sig=${Math.random()})`;
};




var avatar = getAvatar()

// emmiting user to main, when he join the room
socket.emit('join', { username, room, avatar }, (error) => {
    if(error){
        alert(error)
        location.href = '/'
    }

    $avatar.style.backgroundImage = avatar;
    $avatar.style.backgroundSize = 'contain';
})

$fileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const $imgFile = document.querySelector('#input').files[0];
    const reader = new FileReader();
    reader.readAsDataURL($imgFile);

    reader.onerror = () => {
        console.log( reader.error);
    }

    reader.onload = () => {
        console.log(reader.result);
        socket.emit('sendFile', {
            imgData: reader.result
        }, () => {
            
            console.log('Image url sended');
        })
    }

    
    
});

