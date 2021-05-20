


var socket = io('http://localhost:8888')
$('#sendnotification').click(() => {
    var status = $('#status').val()
    var image = $('#image').val()
    var video = $('#video').val()

socket.emit('sendNoti', {
    'status': status,
    'image': image,
    'video': video
    })
})



socket.on('sendNotifi', details => {
  console.log(details)
  $.notify('hello')
})