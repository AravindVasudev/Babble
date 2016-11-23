var socket = io();
var audio = new Audio('media/chat.mp3');
$('form').submit(function(){
  if($('#type-message').val() === '') return false;
  socket.emit('chat message', $('#type-message').val());
  $('#type-message').val('');
  return false;
});
socket.on('chat message', function(msg){
  let mojifiedMsg = twemoji.parse(msg.msg);
  let message = "";
  if(msg.id == $('#userid').val()) {
    message = `<div class="message-me"><span class="msg">${mojifiedMsg}</span><span class="time noselect">${msg.time}</span></div>`;
  }
  else {
    message = `<div class="message"><span class="username noselect">${msg.name}</span><span class="msg">${mojifiedMsg}</span><span class="time noselect">${msg.time}</span></div>`;
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

socket.on('bot', function(msg){
  let message = `<div class="message-bot noselect"><kbd>${msg.msg}</kbd></div>`;

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
    $box.val(`${$box.val()}${$(this).attr('alt')}`);
    $box.focus();
  });

  $( "main" ).contextmenu(function(e) {
    $('.context-menu').css({
      left: e.pageX,
      top: e.pageY
    });
    $('.context-menu').hide();
    $('.context-menu').slideDown(300);

    return false;
  });

  $( "main" ).click(function(e) {
    $('.context-menu').slideUp(300);

    return false;
  });

  $( ".emoji" ).contextmenu(function() {
    socket.emit('chat message', `${$(this).attr('alt')}`);
    return false;
  });

  $('.dropdown').on('show.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });

  $('.dropdown').on('hide.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });


    var fileTypes = ['jpg', 'jpeg', 'png'];
    //Send Image
    $('#file').change(function() {
      var image  = this.files[0];

      var ext = image.name.split('.').pop().toLowerCase();

      if(fileTypes.indexOf(ext) > -1) {
        var reader = new FileReader();

        reader.addEventListener("load", function () {
          // preview.src = reader.result;
          socket.emit('chat image', reader.result);
        }, false);

        if (file) {
          reader.readAsDataURL(image);
        }
      }
      else {
        $('#messages').append(`<div class="message-bot noselect"><kbd>Not an Image!</kbd></div>`);
        $(".messages").scrollTop($(".messages").children().height());
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
