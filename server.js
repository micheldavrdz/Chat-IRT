// Declaracion requerimentos
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
// util propia para formatear mensajes con moment
const formatoMensaje = require('./utils/mensajes');
// util propia para manejar usuarios
const { agregarUsuario, obtenerUsuario, salirUsuario, obtenerUsuariosCanal} = require('./utils/usuarios');
const nombreBot = 'ChatBot';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Declarando el static dir de la aplicacion usando path
app.use(express.static(path.join(__dirname, 'public')));

// Crear un mensaje cada vez que se conecte un cliente

// socket.emit es para enviar el mensaje al usuario que se conecto
// socket.broadcast es para enviar el mensaje a todos los usuarios excepto al que se conecto
// io.emit es para enviar el mensaje a TODOS los usuarios
// .to(usuario.canal) es para enviar el mensaje solo a los usuarios que estan en ese canal
io.on('connection', (socket) => {

    //Entrar al canal
    socket.on('entrarCanal', ({ user, channel }) => {
        // Agregar usuario al canal
        const usuario = agregarUsuario(socket.id, user, channel);

        socket.join(usuario.canal);

        // Mensaje de bienvenida al usuario
        socket.emit('mensaje', formatoMensaje(nombreBot, 'Bienvenid@ al chat'));

        // Mensaje cuando un usuario se conecta
        socket.broadcast.to(usuario.canal).emit('mensaje', formatoMensaje(nombreBot, `${usuario.nomusuario} se ha conectado`));

        // Mostrar usuarios conectados en el canal en el sidebar
        io.to(usuario.canal).emit('usuariosCanal', {
            canal: usuario.canal,
            usuarios: obtenerUsuariosCanal(usuario.canal)
        });

    });

    // Esperar mensajes del chat (mensaje_canal)
    socket.on('mensajeCanal', (msg) => {
        const usuario = obtenerUsuario(socket.id);

        io.to(usuario.canal).emit('mensaje', formatoMensaje(usuario.nomusuario, msg));
    });

    // Mensaje cuando un usuario se desconecta
    socket.on('disconnect', () => {
        const usuario = salirUsuario(socket.id);

        if(usuario) {
            io.to(usuario.canal).emit('mensaje', formatoMensaje(nombreBot, `${usuario.nomusuario} se ha desconectado`));

            // Mostrar si un usuario se desconecta del canal en el sidebar
            io.to(usuario.canal).emit('usuariosCanal', {
                canal: usuario.canal,
                usuarios: obtenerUsuariosCanal(usuario.canal)
            });
        }
    });
});

// Declarando el puerto de la aplicacion
const appPort = 3000 || process.env.appPort;

server.listen(appPort, () => console.log(`El servidor esta corriendo en el puerto ${appPort}`));