const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const registrarUsuario = async (req, res) => {
    try{
        const{nombre, email, contrasena} = req.body;

        // comprobamos si el email ya existe en la base de datos
        const usuarioExistente = await Usuario.findOne({where: {email}});
        if (usuarioExistente){
            return res.status(400).json({
                msg: 'El email ingresado ya se encuentra registrado.'
            });
        }

        // Generamos el hash de la contraseña
        const salt = bcrypt.genSaltSync(10);
        const contrasenaHasheada = bcrypt.hashSync(contrasena, salt);

        // Creamos el usuario (acordate de pasarle la hasheada, no la original)
        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            contrasena: contrasenaHasheada 
        });

        // respondemos excluyendo la contraseña
        return res.status(201).json({
            msg: 'Usuario registrado con éxito.',
            usuario: {
                id_usuario: nuevoUsuario.id_usuario,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch(error) {
        console.error('Error al registrar usuario: ', error);
        return res.status(500).json({
            error: 'Hubo un error interno al intentar registrar el usuario.'
        });
    }
};

const loginUsuario = async (req, res) =>{
    try{
        const{email, contrasena} = req.body;

        // buscamos el usuario por el email
        const usuario = await Usuario.findOne({where: {email}});

        // si no existe devuelve error
        if(!usuario){
            return res.status(404).json({
                msg: 'Credenciales inválidas (Usuario no encontrado).'
            });
        }

        // comparamos las contraseñas
        // comparamos las contraseñas con bcrypt
        const passwordValido = bcrypt.compareSync(contrasena, usuario.contrasena);
        if(!passwordValido){
            return res.status(401).json({
                msg: 'Credenciales inválidas (Contraseña incorrecta).'
            });
        }

        // Generamos el token JWT
        const payload = { id_usuario: usuario.id_usuario };
        const token = jwt.sign(payload, process.env.SECRET_KEY || 'TU_PALABRA_SECRETA', {
            expiresIn: '4h' // El token dura 4 horas
        });

        // login exitoso (devolvemos el token al frontend)
        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            usuario:{
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email
            },
            token 
        });
        
    } catch (error){
        console.error('Error en el login: ', error);
        return res.status(500).json({
            error: 'Hubo un error interno al intentar iniciar sesión.'
        });
    }
}

const actualizarUsuario = async(req, res) => {
    try{
        const {id_usuario} = req.params;
        const {nombre, email, contrasena} = req.body;

        // busca el usuario por su clave primaria
        const usuario = await Usuario.findByPk(id_usuario);

        if(!usuario){
            return res.status(404).json ({msg: 'No se encontró el usuario a actualizar'});
        }

        // si quiere cambiar el email, nos fijamos si el nuevo email no esta ocupado
        if(email && email !== usuario.email){
            const emailEnUso = await Usuario.findOne({where: {email}});
            if(emailEnUso){
                return res.status(400).json({msg: 'El nuevo email ya está registrado por otro usuario.'});
            }
        }

        let contrasenaNueva = usuario.contrasena; 
        if (contrasena) {
            const salt = bcrypt.genSaltSync(10);
            contrasenaNueva = bcrypt.hashSync(contrasena, salt);
        }

        // actualizamos los datos, usamos OR para mantener el dato viejo si no nos envian nada
        await usuario.update({
            nombre: nombre || usuario.nombre,
            email: email || usuario.email,
            contrasena: contrasenaNueva
        });
        return res.status(200).json({
            msg: 'Usuario actualizado con éxito.',
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                email: usuario.email
            }
        });
    } catch(error) {
        console.error('Error al actualizar usuario: ', error);
        return res.status(500).json({
            error: 'Hubo un error interno al intentar actualizar los datos del usuario.'
        });
    }
};

const obtenerTodosLosUsuarios = async (req, res) => {
    try{
        const usuarios = await Usuario.findAll({
            attributes: {exclude: ['contrasena']}
        });

        return res.status(200).json(usuarios);
    } catch (error){
        console.error('Error al obtener los usuarios: ', error);
        return res.status(500).json({
            error: 'Hubo un error interno al intentar obtener la lista de usuarios.'
        });
    }
};

const obtenerUsuarioPorId = async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const usuario = await Usuario.findByPk(id_usuario, {
            attributes: { exclude: ['contrasena'] }
        });

        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado.' });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({ error: 'Error interno al obtener el usuario.' });
    }
};

module.exports = {
    registrarUsuario,
    loginUsuario,
    obtenerTodosLosUsuarios,
    actualizarUsuario,
    obtenerUsuarioPorId
};