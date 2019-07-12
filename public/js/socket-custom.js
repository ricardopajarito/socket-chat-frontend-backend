//configuracion del frontend
// se puede usar una funcion anonima
//para protejer a socket
var socket = io();

//on escuchar informacion
socket.on('connect', function() {
    console.log('Conectado al servidor');
});

socket.on('disconnect', function() {
    console.log('Se perdio la conexion con el servidor');
});


//emit(nombreobjeto, objeto, funcion si lo entrego)
socket.emit('enviarMensaje', {
    usuario: 'Ricardo',
    mensaje: 'Hola servidor'
}, function(resp) {
    //console.log('Se disparo el callback'); por parte del servidor
    console.log('respuesta del server: ', resp);
});

//Escuchar informacion
//recibo una funcion
socket.on('enviarMensaje', function(mensaje) {
    console.log('Servidor: ', mensaje);
});