const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');
const usuarios = new Usuarios();

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('entrarChat', (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario es necesario'
            });
        }
        //con esto se une a una sala
        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);
        //para que el cliente envie solo a una sala en especifico ya que se unió a una
        client.broadcast.to(data.sala).emit('listaPersona', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} se unió`));
        callback(usuarios.getPersonasPorSala(data.sala));
    });
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });
    client.on('disconnect', () => {

        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersona', usuarios.getPersonasPorSala(personaBorrada.sala));

    });
    client.on('mensajePrivado', (data) => {
        //ya se que persona manda el mensaje
        let persona = usuarios.getPersona(client.id);
        //para hacer p2p
        client.broadcast.to(data.destino).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });
});