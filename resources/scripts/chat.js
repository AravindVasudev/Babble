var socket = io();
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
  // console.log(msg.activeUsers);
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

socket.on('userList', function(msg){
  console.log(msg);
});

$(function() {
  // $('.menu-button').click(function() {
  //   this.classList.toggle("change");
  // });
});
