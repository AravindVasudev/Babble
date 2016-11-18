var socket = io();
$('form').submit(function(){
  if($('#type-message').val() === '') return false;
  socket.emit('chat message', $('#type-message').val());
  $('#type-message').val('');
  return false;
});
socket.on('chat message', function(msg){
  let message = "";
  let time = formatAMPM(new Date());
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-me"><span class="msg">${msg.msg}</span><span class="time noselect">${time}</span></div>`;
  }
  else {
    message = `<div class="message"><span class="username noselect">${msg.name}</span><span class="msg">${msg.msg}</span><span class="time noselect">${time}</span></div>`;
  }
  // console.log(msg.activeUsers);
  $('#messages').append(message);
  $(".messages").scrollTop($(".messages").children().height());
});


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

$(function() {
  // $('.menu-button').click(function() {
  //   this.classList.toggle("change");
  // });
});
