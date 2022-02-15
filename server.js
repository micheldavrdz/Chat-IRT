// Declaracion requerimentos
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Declarando el static dir de la aplicacion usando path
app.use(express.static(path.join(__dirname, 'public')));

// Crear un log cada vez que se conecte un cliente
io.on('conexion', (socket) => {
    console.log('Nueva conexion: ', socket.id);
});

// Declarando el puerto de la aplicacion
const app_port = 3000 || process.env.app_port;

server.listen(app_port, () => console.log(`El servidor esta corriendo en el puerto ${app_port}`));