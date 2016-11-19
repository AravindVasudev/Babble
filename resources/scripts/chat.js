var socket = io();
var audio = new Audio('media/chat.mp3');
$('form').submit(function(){
  if($('#type-message').val() === '') return false;
  socket.emit('chat message', $('#type-message').val());
  $('#type-message').val('');
  return false;
});
socket.on('chat message', function(msg){
  let message = "";
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-me"><span class="msg">${msg.msg}</span><span class="time noselect">${msg.time}</span></div>`;
  }
  else {
    message = `<div class="message"><span class="username noselect">${msg.name}</span><span class="msg">${msg.msg}</span><span class="time noselect">${msg.time}</span></div>`;
  }
  audio.play();
  navigator.vibrate(100);
  $('#messages').append(message);
  $(".messages").scrollTop($(".messages").children().height());
});

socket.on('join', function(msg){
  let message = '';
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-bot noselect"><kbd>you joined the chatroom</kbd></div>`;
  }
  else {
    message = `<div class="message-bot noselect"><kbd>${msg.user} has joined</kbd></div>`;
  }

  $('#messages').append(message);
  $(".messages").scrollTop($(".messages").children().height());
});

socket.on('leave', function(msg){
  let message = '';
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-bot noselect"><kbd>disconnected</kbd></div>`;
  }
  else{
    message = `<div class="message-bot noselect"><kbd>${msg.user} has left</kbd></div>`;
  }
  $('#messages').append(message);
  $(".messages").scrollTop($(".messages").children().height());
});


$(function() {
  $('.emoji').click(function() {
    let $box = $('#type-message');
    $box.val(`${$box.val()}${$(this).text()}`);
    $box.focus();
  });

  $( ".emoji" ).contextmenu(function() {
    socket.emit('chat message', `<span class="memoji">${$(this).text()}</span>`);
    return false;
  });
});
