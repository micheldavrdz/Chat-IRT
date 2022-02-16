const moment = require('moment');

function formatoMensaje(usuario, texto) {
    return {
        usuario,
        texto,
        hora: moment().format('h:mm a')
    };
}

module.exports = formatoMensaje;