const usuarios = [];

//Agregar usuario al canal
function agregarUsuario(id, nomusuario, canal) {
    const usuario = { id, nomusuario, canal };
    usuarios.push(usuario);
    return usuario;
}

//Obtener usuario por id
function obtenerUsuario(id) {
    return usuarios.find(usuario => usuario.id === id);
}

//Usuario sale del canal
function salirUsuario(id) {
    //Si encuentra al usuario lo regresa, si no regresa -1
    const index = usuarios.findIndex(usuario => usuario.id === id);

    //Si no lo encuentra, nos regresa el index sin ese usuario
    if(index !== -1) {
        return usuarios.splice(index, 1)[0];
    }
}

//Obtener usuarios por canal
function obtenerUsuariosCanal(canal) {
    return usuarios.filter(usuario => usuario.canal === canal);
}

module.exports = {
    agregarUsuario, 
    obtenerUsuario,
    salirUsuario,
    obtenerUsuariosCanal
}