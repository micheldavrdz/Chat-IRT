const formulario = document.getElementById('chat-form');
const mensajesCanal = document.querySelector('.chat-messages');
const nombreCanal = document.getElementById('room-name');
const listaUsuarios = document.getElementById('users');

//Obtener usuario y canal desde la URL sin & y demas simbolos utilizanso Qs
const { user, channel } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

//Unirse a canal
socket.emit('entrarCanal', { user, channel });

//Obtener usuarios y canal
socket.on('usuariosCanal', ({ usuarios, canal }) => {
    mostrarUsuarios(usuarios);
    mostrarCanal(canal);
});

socket.on('mensaje', mensaje => {
    console.log(mensaje);
    enviarMensaje(mensaje);

    // Hacer scroll al final del canal
    mensajesCanal.scrollTop = mensajesCanal.scrollHeight;
})

// Enviar mensaje al canal
formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener el texto del mensaje enviado
    const msg = e.target.elements.msg.value;

    // Enviar mensaje al server
    socket.emit('mensajeCanal', msg);

    // Limpiar la caja de mensaje
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Enviar mensaje al DOM
function enviarMensaje(mensaje) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${mensaje.usuario}<span> ${mensaje.hora}</span></p>
        <p class="text">
            ${mensaje.texto}
        </p>
    `;

    mensajesCanal.appendChild(div);
}

// Agregar usuario al DOM
function mostrarUsuarios(usuarios) {
    listaUsuarios.innerHTML = `
        ${usuarios.map(usuario => `<li>${usuario.nomusuario}</li>`).join('')}
    `;

}

//Agregar canal al DOM
function mostrarCanal(canal) {
    nombreCanal.innerText = canal;
}