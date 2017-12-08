window.addEventListener('load', () => {
  const nickname = pickUsername();
  window.sessionStorage.setItem('nickname', nickname);
  socket.emit('add user', nickname);

  document.getElementById('send-message-button').addEventListener('click', sendMessage);
  document.getElementById('input-message').addEventListener('keydown', function(e) {
    if (e.which == 13) {
        e.preventDefault();
        sendMessage();
    }
  });

});

const socket = io();

socket.on('new message', function (data) {
  printNewMessage(data.message, data.nickname);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', function (data) {
  //addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', function (data) {
  addParticipantsMessage(data);
  removeChatTyping(data);
});

function sendMessage() {
  const input = document.getElementById('input-message');
  const message = getMessageTextAndClearInput(input);

  if (message) {
    const author = window.sessionStorage.getItem('nickname');
    printNewMessage(message, author);
    socket.emit('new message', {nickname: author, message: message});
  }
}

function pickUsername() {
  let username;
  while(!username) {
    username = prompt('Please, enter your nickname.');
  }
  return username;
}

function getMessageTextAndClearInput(el) {
  const message = el.value;
  el.value = '';
  return message;
}

function printNewMessage(messageText, nickname) {

  //if author == nickname - left. else - right

  const date = new Date();
  const elementClass = nickname == window.sessionStorage.getItem('nickname') ? 'chat-message-me' : 'chat-message-other';

  // TODO: Refactor it
  // dd.mm hh:mm:ss
  const dateFromatted = `${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  const messageEl = `
    <div class="${elementClass}">
      <span class="message-nickname"><b>${nickname}</b></span>   <span class="message-date">${dateFromatted}</span>
      <p>${messageText}</p>
    </div>
  `;
  document.getElementById('conversation-messages').insertAdjacentHTML('beforeend', messageEl);
}
