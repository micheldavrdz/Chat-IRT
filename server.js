// Declaracion requerimentos
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Declarando el static dir de la aplicacion usando path
app.use(express.static(path.join(__dirname, 'public')));

// Crear un mensaje cada vez que se conecte un cliente

// socket.emit es para enviar el mensaje al usuario que se conecto
// socket.broadcast es para enviar el mensaje a todos los usuarios excepto al que se conecto
// io.emit es para enviar el mensaje a TODOS los usuarios
io.on('connection', (socket) => {

    // Mensaje de bienvenida al usuario
    socket.emit('mensaje', 'Bienvenid@ al chat');

    // Mensaje cuando un usuario se conecta
    socket.broadcast.emit('mensaje', 'Un usuario se ha conectado al canal');

    // Mensaje cuando un usuario se desconecta
    socket.on('disconnect', () => {
        io.emit('mensaje', 'Un usuario se ha desconectado del canal');
    });

    // Esperar mensajes del chat (mensaje_canal)
    socket.on('mensajeCanal', (msg) => {
        io.emit('mensaje', msg);
    });
});

// Declarando el puerto de la aplicacion
const appPort = 3000 || process.env.appPort;

server.listen(appPort, () => console.log(`El servidor esta corriendo en el puerto ${appPort}`));