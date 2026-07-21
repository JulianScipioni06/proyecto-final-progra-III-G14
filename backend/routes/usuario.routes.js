const { Router } = require('express');
const router = Router();

const {
    registrarUsuario,
    loginUsuario,
    obtenerTodosLosUsuarios,
    actualizarUsuario,
    obtenerUsuarioPorId
} = require('../controllers/usuario.controller');

// importamos el middleware de validacion
const{validateInputUsuario} = require('../middleware/usuario-validator.middleware');
const { validarJWT } = require('../middleware/validar-jwt.middleware');

// rutas
router.post('/registrar', validateInputUsuario, registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', obtenerTodosLosUsuarios);
router.put('/:id_usuario', validateInputUsuario, actualizarUsuario);
router.get('/:id_usuario', validarJWT, obtenerUsuarioPorId);

module.exports = router;