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

socket.on('chat image', function(msg) {
  let message = "";
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-me"><span class="image"><img src="${msg.image}" class="img-responsive"></span><span class="time noselect">${msg.time}</span></div>`;
  }
  else {
    message = `<div class="message"><span class="username noselect">${msg.name}</span><span class="image"><img src="${msg.image}" class="img-responsive"></span><span class="time noselect">${msg.time}</span></div>`;
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

  $('.dropdown').on('show.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });

  $('.dropdown').on('hide.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });

    //Send Image
    $('#file').change(function() {
      var image  = this.files[0];
      // var preview = document.getElementById('test');

      var reader = new FileReader();

      reader.addEventListener("load", function () {
        // preview.src = reader.result;
        socket.emit('chat image', reader.result);
      }, false);

      if (file) {
        reader.readAsDataURL(image);
      }
    });

  function toggleFullscreen(elem) {
    elem = elem || document.documentElement;

    if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  $('.image > img').click(function() {
    toggleFullscreen(this);
  });
});
